using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using nns_backend.DTO;
using nns_backend.Entities;
using nns_backend.Interfaces;
using nns_backend.Utils;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace nns_backend.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly NNSDBContext _context;
        private readonly ICurrentTime _timeService;
        private readonly IClaimsService _claimsService;
        private readonly IConfiguration _configuration;

        // identity collection
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;
        private readonly SignInManager<User> _signInManager;

        public UserRepository(NNSDBContext context, ICurrentTime timeService, IClaimsService claimsService, IConfiguration configuration, UserManager<User> userManager, RoleManager<Role> roleManager, SignInManager<User> signInManager)
        {
            _context = context;
            _timeService = timeService;
            _claimsService = claimsService;
            _configuration = configuration;
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
        }

        public async Task<User> AddUser(UserSignupDTO newUser, string role)
        {
            try
            {
                var userExist = await _userManager.FindByEmailAsync(newUser.Email);
                if (userExist != null)
                {
                    return null;
                }
                var user = new User
                {
                    Email = newUser.Email,
                    FullName = newUser.FullName,
                    Dob = newUser.Dob,
                    PhoneNumber = newUser.PhoneNumber,
                    ImageUrl = newUser.ImageUrl,
                    ThumbnailUrl = newUser.ThumbnailUrl,
                    Description = newUser.Description,
                    Address = newUser.Address,
                    CreatedBy = _claimsService.GetCurrentUserId,
                    CreatedDate = _timeService.GetCurrentTime()
                };

                var result = await _userManager.CreateAsync(user, newUser.Password);
                if (result.Succeeded)
                {
                    Console.WriteLine($"New user ID: {user.Id}");

                    // Kiểm tra xem vai trò đã tồn tại chưa, nếu chưa thì tạo vai trò mới đã tôi ưu
                    var roleExists = await _roleManager.RoleExistsAsync(role.ToUpper());
                    if (!roleExists)
                    {
                        var newRole = new Role();
                        newRole.Name = role;

                        await _roleManager.CreateAsync(newRole);
                    }

                    // Nếu vai trò tồn tại, gán vai trò cho người dùng
                    if (roleExists)
                    {
                        await _userManager.AddToRoleAsync(user, role);
                    }

                    return user;
                }
                else
                {
                    // Tạo người dùng không thành công, xem thông tin lỗi và xử lý
                    StringBuilder errorValue = new StringBuilder();
                    foreach (var item in result.Errors)
                    {
                        errorValue.Append($"{item.Description}");
                    }
                    throw new Exception(errorValue.ToString()); // bắn zề cho GlobalEx midw
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<string> GenerateTokenForResetPassword(User user)
        {
            return await _userManager.GeneratePasswordResetTokenAsync(user);
        }

        public async Task<ResponseLoginDTO> LoginByEmailAndPassword(UserLoginDTO User)
        {
            var userExist = await _userManager.FindByEmailAsync(User.Email);
            if (userExist == null)
            {
                return null;
            }

            var result = await _signInManager.CheckPasswordSignInAsync(userExist, User.Password, false);

            if (result.Succeeded)
            {
                var roles = await _userManager.GetRolesAsync(userExist);

                var authClaims = new List<Claim> // add User vào claim
                {
                    new Claim(ClaimTypes.Name, userExist.Id.ToString()),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };

                foreach (var role in roles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, role));
                }
                //generate refresh token
                var refreshToken = TokenTools.GenerateRefreshToken();
                _ = int.TryParse(_configuration["JWT:RefreshTokenValidityInDays"], out int refreshTokenValidityInDays);
                userExist.RefreshToken = refreshToken;
                userExist.RefreshTokenExpiryTime = _timeService.GetCurrentTime().AddDays(refreshTokenValidityInDays);

                await _userManager.UpdateAsync(userExist); //update 2 jwt
                var token = GenerateJWTToken.CreateToken(authClaims, _configuration, _timeService.GetCurrentTime());
                return new ResponseLoginDTO
                {
                    Token = new JwtSecurityTokenHandler().WriteToken(token),
                    RefreshToken = refreshToken,
                    UserId = userExist.Id,
                    FullName = userExist.FullName,
                    Email = userExist.Email,
                    Dob = userExist.Dob,
                    PhoneNumber = userExist.PhoneNumber,
                    ImageUrl = userExist.ImageUrl,
                    ThumbnailUrl = userExist.ThumbnailUrl,
                    Description = userExist.Description,
                    Address = userExist.Address,
                    Roles = roles.ToList()
                };
            }
            else
            {
                return null;
            }
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            var result = await _userManager.FindByEmailAsync(email);
            if (result == null)
            {
                return null;
            }
            return result;
        }

        public async Task<User> GetUserByIdAsync(int id)
        {
            var result = await _userManager.FindByIdAsync(id.ToString());
            if (result == null)
            {
                return null;
            }
            return result;
        }

        public async Task<User> UpdateAccountAsync(User user)
        {
            try
            {
                user.ModifiedDate = _timeService.GetCurrentTime();
                user.ModifiedBy = _claimsService.GetCurrentUserId;
                var result = await _userManager.UpdateAsync(user);
                if (result.Succeeded)
                {
                    return user;
                }
                else
                {
                    // Tạo người dùng không thành công, xem thông tin lỗi và xử lý
                    StringBuilder errorValue = new StringBuilder();
                    foreach (var item in result.Errors)
                    {
                        errorValue.Append($"{item.Description}");
                    }
                    throw new Exception(errorValue.ToString()); // bắn zề cho GlobalEx midw
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<User> GetAccountDetailsAsync(int userId)
        {
            var accounts = await _userManager.FindByIdAsync(userId.ToString());
            var account = await _context.Users.FirstOrDefaultAsync(a => a.Id == userId);
            if (account == null)
            {
                return null;
            }
            return account;
        }

        public async Task<User> SoftRemoveUserAsync(int id)
        {
            try
            {
                var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Id == id);
                if (user == null)
                {
                    throw new Exception("This user is not existed");
                }

                user.IsDeleted = true;
                user.DeletionDate = _timeService.GetCurrentTime();
                user.DeleteBy = _claimsService.GetCurrentUserId;
                _context.Entry(user).State = EntityState.Modified;
                // await _dbContext.SaveChangesAsync();

                return user;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<bool> UpdateUserRoleAsync(int userId, string newRole)
        {
            // Tìm người dùng theo ID
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null)
            {
                throw new Exception("User not found.");
            }

            // Lấy các vai trò hiện tại của người dùng
            var currentRoles = await _userManager.GetRolesAsync(user);

            // Xóa các vai trò hiện tại của người dùng
            var removeRolesResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
            if (!removeRolesResult.Succeeded)
            {
                StringBuilder errorMessages = new StringBuilder();
                foreach (var error in removeRolesResult.Errors)
                {
                    errorMessages.Append(error.Description);
                }
                throw new Exception($"Failed to remove current roles: {errorMessages}");
            }

            // Kiểm tra xem vai trò mới có tồn tại chưa
            var roleExists = await _roleManager.RoleExistsAsync(newRole);
            if (!roleExists)
            {
                // Nếu vai trò chưa tồn tại, tạo vai trò mới
                var role = new Role();
                role.Name = newRole;
                var newRoleResult = await _roleManager.CreateAsync(role);
                if (!newRoleResult.Succeeded)
                {
                    throw new Exception("Failed to create new role.");
                }
            }

            // Thêm vai trò mới cho người dùng
            var addRoleResult = await _userManager.AddToRoleAsync(user, newRole);
            if (!addRoleResult.Succeeded)
            {
                StringBuilder errorMessages = new StringBuilder();
                foreach (var error in addRoleResult.Errors)
                {
                    errorMessages.Append(error.Description);
                }
                throw new Exception($"Failed to add new role: {errorMessages}");
            }

            return true;
        }

        public async Task<User> GetCurrentUserAsync()
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Id == _claimsService.GetCurrentUserId);
            if (user != null)
            {
                return user;
            }

            return null;
        }

        public async Task<List<Role>> GetAllRoleAsync()
        {
            try
            {
                // get all users
                var roles = await _roleManager.Roles.ToListAsync();
                return roles;
            }
            catch (Exception)
            {
                throw new Exception();
            }
        }

        public async Task<List<string>> GetRoleName(User User)
        {
            var result = await _userManager.GetRolesAsync(User);

            return result.ToList();
        }

        public async Task<string> GenerateEmailConfirmationToken(User user)
        {
            return await _userManager.GenerateEmailConfirmationTokenAsync(user);
        }

        public async Task<List<User>> GetUsersAsync()
        {
            try
            {
                var users = await _context.Users.ToListAsync();

                return users;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<User> AddAgentWithPreferencesAsync(UserSignupDTO newUser)
        {
            try
            {
                var existingUser = await _userManager.FindByEmailAsync(newUser.Email);
                if (existingUser != null)
                {
                    throw new Exception("User with this email already exists.");
                }

                var user = new User
                {
                    Email = newUser.Email,
                    FullName = newUser.FullName,
                    Dob = newUser.Dob,
                    PhoneNumber = newUser.PhoneNumber,
                    ImageUrl = newUser.ImageUrl,
                    ThumbnailUrl = newUser.ThumbnailUrl,
                    Description = newUser.Description,
                    Address = newUser.Address,
                    CreatedBy = _claimsService.GetCurrentUserId,
                    CreatedDate = _timeService.GetCurrentTime(),
                    UserName = newUser.Email
                };

                var result = await _userManager.CreateAsync(user, newUser.Password);
                if (!result.Succeeded)
                {
                    throw new Exception("Failed to create user.");
                }

                // Add role to user
                var roleExists = await _roleManager.RoleExistsAsync("AGENT");
                if (!roleExists)
                {
                    await _roleManager.CreateAsync(new Role { Name = "AGENT" });
                }
                await _userManager.AddToRoleAsync(user, "AGENT");

                // Add AgentProductPreferences
                foreach (var preferenceDTO in newUser.agentProductPreferenceCreateDTOs)
                {
                    var preference = new AgentProductPreference
                    {
                        UserId = user.Id,
                        ProductTypeId = preferenceDTO.ProductTypeId,
                        Description = preferenceDTO.Description,
                        CreatedAt = _timeService.GetCurrentTime(),
                        UpdatedAt = _timeService.GetCurrentTime()
                    };
                    _context.AgentProductPreferences.Add(preference);
                }

                await _context.SaveChangesAsync();

                return user;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
