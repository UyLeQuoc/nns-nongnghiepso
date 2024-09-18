using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using nns_backend.DTO;
using nns_backend.Entities;
using nns_backend.Interfaces;

namespace nns_backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AgriculturalProductController : ControllerBase
    {
        private readonly ILogger<AgriculturalProductController> _logger;
        private readonly IAgriculturalProductRepository _agriculturalProductRepository;
        private readonly IMapper _mapper;

        public AgriculturalProductController(ILogger<AgriculturalProductController> logger, IAgriculturalProductRepository agriculturalProductRepository, IMapper mapper)
        {
            _logger = logger;
            _agriculturalProductRepository = agriculturalProductRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<AgriculturalProductResponseDTO>>> GetAgriculturalProducts()
        {
            var products = await _agriculturalProductRepository.GetAgriculturalProductsAsync();
            var productDTOs = _mapper.Map<List<AgriculturalProductResponseDTO>>(products);
            return Ok(productDTOs);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AgriculturalProductResponseDTO>> GetAgriculturalProductById(int id)
        {
            var product = await _agriculturalProductRepository.GetAgriculturalProductByIdAsync(id);
            if (product == null)
            {
                return NotFound();
            }
            var productDTO = _mapper.Map<AgriculturalProductResponseDTO>(product);
            return Ok(productDTO);
        }

        [HttpPost]
        public async Task<ActionResult<AgriculturalProductResponseDTO>> CreateAgriculturalProduct(AgriculturalProductCreateDTO createDTO)
        {
            var product = _mapper.Map<AgriculturalProduct>(createDTO);
            product.CreatedAt = DateTime.UtcNow;
            product = await _agriculturalProductRepository.CreateAgriculturalProductAsync(product);
            var productDTO = _mapper.Map<AgriculturalProductResponseDTO>(product);
            return CreatedAtAction(nameof(GetAgriculturalProductById), new { id = productDTO.Id }, productDTO);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAgriculturalProduct(int id, AgriculturalProductUpdateDTO updateDTO)
        {
            var product = await _agriculturalProductRepository.GetAgriculturalProductByIdAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            updateDTO.Id = id;
            _mapper.Map(updateDTO, product);
            await _agriculturalProductRepository.UpdateAgriculturalProductAsync(product);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAgriculturalProduct(int id)
        {
            var product = await _agriculturalProductRepository.GetAgriculturalProductByIdAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            await _agriculturalProductRepository.DeleteAgriculturalProductAsync(id);

            return NoContent();
        }
    }
}
