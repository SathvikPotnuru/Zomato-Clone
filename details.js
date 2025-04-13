document.addEventListener('DOMContentLoaded', function() {
  const restaurantDetails = document.getElementById('restaurantDetails');
  const params = new URLSearchParams(window.location.search);
  const restaurantId = params.get('id');

  if (restaurantId) {
    fetch(`/restaurant/details?id=${restaurantId}`)
      .then(response => response.json())
      .then(data => {
        restaurantDetails.innerHTML = `
          <h2>${data.RestaurantName}</h2>
          <p><strong>Address:</strong> ${data.Address}</p>
          <p><strong>Locality:</strong> ${data.Locality}</p>
          <p><strong>Cuisines:</strong> ${data.Cuisines}</p>
          <p><strong>Average Cost for Two:</strong> ${data.AverageCostForTwo} ${data.Currency}</p>
          <p><strong>Rating:</strong> ${data.AggregateRating} (${data.RatingText})</p>
          <p><strong>Votes:</strong> ${data.Votes}</p>
        `;
      })
      .catch(error => {
        console.error('Error fetching restaurant details:', error);
        restaurantDetails.textContent = 'Error fetching restaurant details.';
      });
  } else {
    restaurantDetails.textContent = 'No restaurant ID provided.';
  }
});
