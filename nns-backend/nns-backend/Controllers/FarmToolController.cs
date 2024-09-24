using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using nns_backend.DTO;
using nns_backend.Entities;
using nns_backend.Interfaces;

namespace nns_backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FarmToolController : ControllerBase
    {
        private readonly ILogger<FarmToolController> _logger;
        private readonly IFarmToolRepository _farmToolRepository;
        private readonly IMapper _mapper;

        public FarmToolController(ILogger<FarmToolController> logger, IFarmToolRepository farmToolRepository, IMapper mapper)
        {
            _logger = logger;
            _farmToolRepository = farmToolRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<FarmToolResponseDTO>>> GetFarmTools()
        {
            var tools = await _farmToolRepository.GetFarmToolsAsync();
            var toolDTOs = _mapper.Map<List<FarmToolResponseDTO>>(tools);
            return Ok(toolDTOs);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FarmToolResponseDTO>> GetFarmToolById(int id)
        {
            var tool = await _farmToolRepository.GetFarmToolByIdAsync(id);
            if (tool == null)
            {
                return NotFound();
            }
            var toolDTO = _mapper.Map<FarmToolResponseDTO>(tool);
            return Ok(toolDTO);
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<List<FarmToolResponseDTO>>> GetFarmToolsByUserId(int userId)
        {
            var tools = await _farmToolRepository.GetFarmToolsByUserIdAsync(userId);
            if (tools == null || !tools.Any())
            {
                return NotFound();
            }
            var toolDTOs = _mapper.Map<List<FarmToolResponseDTO>>(tools);
            return Ok(toolDTOs);
        }

        [HttpPost]
        public async Task<ActionResult<FarmToolResponseDTO>> CreateFarmTool(FarmToolCreateDTO createDTO)
        {
            var tool = _mapper.Map<FarmTool>(createDTO);
            tool.CreatedAt = DateTime.UtcNow; // Assuming CreatedAt is a property in FarmTool
            tool = await _farmToolRepository.CreateFarmToolAsync(tool);
            var toolDTO = _mapper.Map<FarmToolResponseDTO>(tool);
            return CreatedAtAction(nameof(GetFarmToolById), new { id = toolDTO.Id }, toolDTO);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFarmTool(int id, FarmToolUpdateDTO updateDTO)
        {
            var tool = await _farmToolRepository.GetFarmToolByIdAsync(id);
            if (tool == null)
            {
                return NotFound();
            }

            updateDTO.Id = id;
            _mapper.Map(updateDTO, tool);
            await _farmToolRepository.UpdateFarmToolAsync(tool);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFarmTool(int id)
        {
            var tool = await _farmToolRepository.GetFarmToolByIdAsync(id);
            if (tool == null)
            {
                return NotFound();
            }

            await _farmToolRepository.DeleteFarmToolAsync(id);

            return NoContent();
        }
    }
}
