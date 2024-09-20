using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using nns_backend.DTO;
using nns_backend.Entities;
using nns_backend.Interfaces;

namespace nns_backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductTypeController : ControllerBase
    {
        private readonly ILogger<ProductTypeController> _logger;
        private readonly IProductTypeRepository _productTypeRepository;
        private readonly IMapper _mapper;

        public ProductTypeController(ILogger<ProductTypeController> logger, IProductTypeRepository productTypeRepository, IMapper mapper)
        {
            _logger = logger;
            _productTypeRepository = productTypeRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<ProductTypeResponseDTO>>> GetProductTypes()
        {
            var productTypes = await _productTypeRepository.GetProductTypesAsync();
            var productTypeDTOs = _mapper.Map<List<ProductTypeResponseDTO>>(productTypes);
            return Ok(productTypeDTOs);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductTypeResponseDTO>> GetProductTypeById(int id)
        {
            var productType = await _productTypeRepository.GetProductTypeByIdAsync(id);
            if (productType == null)
            {
                return NotFound();
            }
            var productTypeDTO = _mapper.Map<ProductTypeResponseDTO>(productType);
            return Ok(productTypeDTO);
        }

        [HttpPost]
        public async Task<ActionResult<ProductTypeResponseDTO>> CreateProductType(ProductTypeCreateDTO createDTO)
        {
            var productType = _mapper.Map<ProductType>(createDTO);
            productType.CreatedAt = DateTime.UtcNow;
            productType = await _productTypeRepository.CreateProductTypeAsync(productType);
            var productTypeDTO = _mapper.Map<ProductTypeResponseDTO>(productType);
            return CreatedAtAction(nameof(GetProductTypeById), new { id = productTypeDTO.Id }, productTypeDTO);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProductType(int id, ProductTypeUpdateDTO updateDTO)
        {
            var productType = await _productTypeRepository.GetProductTypeByIdAsync(id);
            if (productType == null)
            {
                return NotFound();
            }

            updateDTO.Id = id;
            _mapper.Map(updateDTO, productType);
            await _productTypeRepository.UpdateProductTypeAsync(productType);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductType(int id)
        {
            var productType = await _productTypeRepository.GetProductTypeByIdAsync(id);
            if (productType == null)
            {
                return NotFound();
            }

            await _productTypeRepository.DeleteProductTypeAsync(id);

            return NoContent();
        }

        [HttpGet("/get-agent-product-types/{userId}")]
        public async Task<ActionResult<List<ProductTypeResponseDTO>>> GetAgentProductTypes(int userId)
        {
            var productTypes = await _productTypeRepository.GetAgentProductTypesAsync(userId);
            var productTypeDTOs = _mapper.Map<List<ProductTypeResponseDTO>>(productTypes);
            return Ok(productTypeDTOs);
        }
    }
}
