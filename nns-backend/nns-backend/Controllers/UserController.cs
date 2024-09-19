using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using nns_backend.DTO;
using nns_backend.Interfaces;

namespace nns_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UserController(ILogger<UserController> logger, IUserRepository userRepository, IMapper mapper)
        {
            _logger = logger;
            _userRepository = userRepository;
            _mapper = mapper;
        }

        // POST: api/User/signup
        [HttpPost("signup")]
        public async Task<IActionResult> Signup(UserSignupDTO userSignupDTO, string role)
        {
            var user = await _userRepository.AddUser(userSignupDTO, role);
            if (user == null)
            {
                return BadRequest("User with this email already exists.");
            }
            return Ok(user);
        }

        // POST: api/User/login
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginDTO loginDTO)
        {
            var response = await _userRepository.LoginByEmailAndPassword(loginDTO);
            if (response == null)
            {
                return Unauthorized("Invalid email or password.");
            }
            return Ok(response);
        }

        // GET: api/User/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _userRepository.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }
            return Ok(user);
        }

        // GET: api/User/email/{email}
        [HttpGet("email/{email}")]
        public async Task<IActionResult> GetUserByEmail(string email)
        {
            var user = await _userRepository.GetUserByEmailAsync(email);
            if (user == null)
            {
                return NotFound("User not found.");
            }
            return Ok(user);
        }

        // PUT: api/User/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserUpdateDTO userUpdateDTO)
        {
            var user = await _userRepository.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            _mapper.Map(userUpdateDTO, user);
            var updatedUser = await _userRepository.UpdateAccountAsync(user);

            return Ok(updatedUser);
        }

        // DELETE: api/User/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> SoftDeleteUser(int id)
        {
            var user = await _userRepository.SoftRemoveUserAsync(id);
            if (user == null)
            {
                return NotFound("User not found or already deleted.");
            }
            return Ok(user);
        }

        // PUT: api/User/{id}/role
        [HttpPut("{id}/role")]
        public async Task<IActionResult> UpdateUserRole(int id, [FromBody] string newRole)
        {
            var result = await _userRepository.UpdateUserRoleAsync(id, newRole);
            if (!result)
            {
                return BadRequest("Failed to update user role.");
            }
            return Ok("User role updated successfully.");
        }

        // GET: api/User/current
        [HttpGet("current")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var currentUser = await _userRepository.GetCurrentUserAsync();
            if (currentUser == null)
            {
                return Unauthorized("No current user found.");
            }
            return Ok(currentUser);
        }

        // GET: api/User/roles
        [HttpGet("roles")]
        public async Task<IActionResult> GetAllRoles()
        {
            var roles = await _userRepository.GetAllRoleAsync();
            return Ok(roles);
        }

        // POST: api/User/{id}/confirm-email
        //[HttpPost("{id}/confirm-email")]
        //public async Task<IActionResult> SendEmailConfirmation(int id)
        //{
        //    var user = await _userRepository.GetUserByIdAsync(id);
        //    if (user == null)
        //    {
        //        return NotFound("User not found.");
        //    }

        //    var token = await _userRepository.GenerateEmailConfirmationToken(user);
        //    // Logic to send email can be added here
        //    return Ok(new { token });
        //}

        // POST: api/User/reset-password
        //[HttpPost("reset-password")]
        //public async Task<IActionResult> GenerateResetPasswordToken([FromBody] string email)
        //{
        //    var user = await _userRepository.GetUserByEmailAsync(email);
        //    if (user == null)
        //    {
        //        return NotFound("User not found.");
        //    }

        //    var token = await _userRepository.GenerateTokenForResetPassword(user);
        //    // Logic to send reset email can be added here
        //    return Ok(new { token });
        //}

        // GET: api/User/all
        [HttpGet("all")]
        public async Task<IActionResult> GetAllUsers()
        {
            var resultUser = new List<ResponseLoginDTO>();
            var users = await _userRepository.GetUsersAsync();
            //Mapper

            for (int i = 0; i < users.Count; i++)
            {
                var roles = await _userRepository.GetRoleName(users[i]);
                var user = _mapper.Map<ResponseLoginDTO>(users[i]);
                user.Roles = roles;
            }
            return Ok(resultUser);
        }

        // POST: api/User/signup-agent
        [HttpPost("signup-agent")]
        public async Task<IActionResult> SignupAgent(UserSignupDTO userSignupDTO)
        {
            try
            {
                var user = await _userRepository.AddAgentWithPreferencesAsync(userSignupDTO);
                return Ok(user);
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
