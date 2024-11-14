using nns_backend.Entities;

namespace nns_backend.Interfaces
{
    public interface IChatRepository
    {
        Task<List<Chat>> GetChatsAsync();
        Task<Chat?> GetChatByIdAsync(int id);
        Task<Chat> CreateChatAsync(Chat chat);
        Task UpdateChatAsync(Chat chat);
        Task DeleteChatAsync(int id);
    }
}
