using Microsoft.EntityFrameworkCore;
using nns_backend.Entities;
using nns_backend.Interfaces;

namespace nns_backend.Repositories
{
    public class ChatRepository : IChatRepository
    {
        private readonly NNSDBContext _context;

        public ChatRepository(NNSDBContext context)
        {
            _context = context;
        }

        public async Task<List<Chat>> GetChatsAsync()
        {
            return await _context.Chats
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();
        }

        public async Task<Chat?> GetChatByIdAsync(int id)
        {
            return await _context.Chats.FindAsync(id);
        }

        public async Task<Chat> CreateChatAsync(Chat chat)
        {
            chat.CreatedAt = DateTime.UtcNow.AddHours(7);
            _context.Chats.Add(chat);
            await _context.SaveChangesAsync();
            return chat;
        }

        public async Task UpdateChatAsync(Chat chat)
        {
            _context.Entry(chat).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteChatAsync(int id)
        {
            var chat = await _context.Chats.FindAsync(id);
            if (chat != null)
            {
                _context.Chats.Remove(chat);
                await _context.SaveChangesAsync();
            }
        }
    }
}
