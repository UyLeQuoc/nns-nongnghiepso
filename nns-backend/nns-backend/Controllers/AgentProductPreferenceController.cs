using Microsoft.AspNetCore.Mvc;
using nns_backend.DTO;
using nns_backend.Interfaces;

namespace nns_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AgentProductPreferenceController : ControllerBase
    {
        private readonly IAgentProductPreferenceRepository _repository;
        private readonly ICurrentTime _currentTime;
        private readonly ILogger<AgentProductPreferenceController> _logger;

        public AgentProductPreferenceController(IAgentProductPreferenceRepository repository, ICurrentTime currentTime, ILogger<AgentProductPreferenceController> logger)
        {
            _repository = repository;
            _currentTime = currentTime;
            _logger = logger;
        }

        // POST: api/AgentProductPreference/transfer-prices
        [HttpPost("transfer-prices")]
        public async Task<IActionResult> TransferTodayPrices([FromBody] DateTime priceUpdateDTO)
        {
            try
            {
                await _repository.TransferTodayPricesToProductTypePricesAsync(priceUpdateDTO);
                return Ok("Prices transferred successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // GET: api/ProductTypePrice/daily-average/{productTypeId}
        [HttpGet("daily-average/{productTypeId}")]
        public async Task<IActionResult> GetDailyAveragePrice(int productTypeId)
        {
            try
            {
                var result = await _repository.GetDailyAveragePriceAsync(productTypeId);
                return Ok(result);
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // GET: api/AgentProductPreference/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<List<AgentProductPreferenceResponseDTO>>> GetAgentProductPreferencesByUserId(int userId)
        {
            var preferences = await _repository.GetAgentProductPreferencesByUserIdAsync(userId);

            if (preferences == null || preferences.Count == 0)
            {
                return NotFound("No preferences found for the specified user.");
            }

            return Ok(preferences);
        }

        [HttpGet("/api/product-types/{productTypeId}")]
        public async Task<ActionResult<List<AgentProductPreferenceResponseDTO>>> GetAgentProductPreferencesByProductTypeId(int productTypeId)
        {
            var preferences = await _repository.GetAgentProductPreferencesByProductTypeIdAsync(productTypeId);

            if (preferences == null || preferences.Count == 0)
            {
                return NotFound("No preferences found for the specified product type.");
            }

            return Ok(preferences);
        }

        [HttpPut("/api/update-agent-product-price")]
        public async Task<IActionResult> UpdateAgentProductPreference([FromBody] UpdateAgentProductPreferenceDTO updateDTO)
        {
            try
            {
                var updatedPreference = await _repository.UpdateAgentProductPreferenceAsync(updateDTO);
                return Ok(updatedPreference); // Return updated data if needed
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // GET: api/AgentProductPreference/prices-with-differences/{userId}
        [HttpGet("prices-with-differences/{userId}")]
        public async Task<IActionResult> GetProductTypePricesWithDifferences(int userId)
        {
            try
            {
                var currentTime = _currentTime.GetCurrentTime(); // Assuming _currentTime service is available
                var result = await _repository.GetProductTypePricesWithDifferencesAsync(userId, currentTime);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("products-with-prices")]
        public async Task<ActionResult<List<AgriculturalProductWithPriceDTO>>> GetProductsWithPrices()
        {
            try
            {
                var currentTime = _currentTime.GetCurrentTime();
                var todayDate = currentTime.Date;
                var targetDate = (currentTime.Hour < 8) ? todayDate.AddDays(-1) : todayDate;

                // Retrieve the products and their prices
                var products = await _repository.GetAllAgriculturalProductsWithPrices(targetDate);

                return Ok(products);
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }
    }
}
