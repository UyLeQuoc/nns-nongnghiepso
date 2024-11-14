using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using nns_backend.DTO;
using nns_backend.Entities;
using nns_backend.Interfaces;

namespace nns_backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly ILogger<ChatController> _logger;
        private readonly IChatRepository _chatRepository;
        private readonly IMapper _mapper;

        public ChatController(ILogger<ChatController> logger, IChatRepository chatRepository, IMapper mapper)
        {
            _logger = logger;
            _chatRepository = chatRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<ChatResponseDTO>>> GetChats()
        {
            var chats = await _chatRepository.GetChatsAsync();
            var chatsDTO = _mapper.Map<List<ChatResponseDTO>>(chats);
            return Ok(chatsDTO);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ChatResponseDTO>> GetChatById(int id)
        {
            var chat = await _chatRepository.GetChatByIdAsync(id);
            if (chat == null)
            {
                return NotFound();
            }
            var chatDTO = _mapper.Map<ChatResponseDTO>(chat);
            return Ok(chatDTO);
        }

        [HttpPost]
        public async Task<ActionResult<ChatResponseDTO>> CreateChat(ChatCreateDTO chatCreateDTO)
        {
            var chat = _mapper.Map<Chat>(chatCreateDTO);
            chat.CreatedAt = DateTime.UtcNow;
            chat = await _chatRepository.CreateChatAsync(chat);
            var chatDTO = _mapper.Map<ChatResponseDTO>(chat);
            return CreatedAtAction(nameof(GetChatById), new { id = chatDTO.Id }, chatDTO);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateChat(int id, ChatUpdateDTO chatUpdateDTO)
        {
            var chat = await _chatRepository.GetChatByIdAsync(id);
            if (chat == null)
            {
                return NotFound();
            }

            chatUpdateDTO.Id = id;

            _mapper.Map(chatUpdateDTO, chat);
            await _chatRepository.UpdateChatAsync(chat);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteChat(int id)
        {
            var chat = await _chatRepository.GetChatByIdAsync(id);
            if (chat == null)
            {
                return NotFound();
            }

            await _chatRepository.DeleteChatAsync(id);

            return NoContent();
        }
    }
}
