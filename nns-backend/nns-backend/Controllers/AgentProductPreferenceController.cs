using Microsoft.AspNetCore.Mvc;
using nns_backend.Interfaces;

namespace nns_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AgentProductPreferenceController : ControllerBase
    {
        private readonly IAgentProductPreferenceRepository _repository;

        public AgentProductPreferenceController(IAgentProductPreferenceRepository repository)
        {
            _repository = repository;
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
    }
}
