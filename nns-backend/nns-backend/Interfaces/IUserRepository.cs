using nns_backend.DTO;
using nns_backend.Entities;

namespace nns_backend.Interfaces
{
    public interface IUserRepository
    {
        Task<User> AddUser(UserSignupDTO newUser, string role);

        Task<User> GetAccountDetailsAsync(int userId);

        Task<List<Role>> GetAllRoleAsync();

        Task<User> GetCurrentUserAsync();

        Task<List<string>> GetRoleName(User User);

        Task<User> GetUserByEmailAsync(string email);

        Task<List<User>> GetUsersAsync();

        Task<ResponseLoginDTO> LoginByEmailAndPassword(UserLoginDTO User);

        Task<User> SoftRemoveUserAsync(int id);

        Task<User> UpdateAccountAsync(User user);

        Task<bool> UpdateUserRoleAsync(int userId, string newRole);

        Task<User> GetUserByIdAsync(int id);
        Task<User> AddAgentWithPreferencesAsync(UserSignupDTO newUser);
    }
}
