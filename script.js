document.addEventListener('DOMContentLoaded', function() {
  const restaurantList = document.getElementById('restaurantList');
  const searchForm = document.getElementById('searchForm');
  const searchTerm = document.getElementById('searchTerm');
  const pageNum = document.getElementById('pageNum');
  const goToPage = document.getElementById('goToPage');
  const avgcostfor2 = document.getElementById('avgcostfor2');
  const cat = document.getElementById('select-search');
  let currentPage = 1;

  function fetchRestaurants(page = 1) {
    fetch(`/restaurants?page=${page}`)
      .then(response => response.json())
      .then(data => {
        restaurantList.innerHTML = '';
        if (data.length > 0) {
          data.forEach(restaurant => {
            const listItem = document.createElement('div');
            listItem.classList.add('restaurant-item');
            listItem.innerHTML = `
              <div>${restaurant.RestaurantName}, ${restaurant.City}</div>
              <div><a href="/restaurant?id=${restaurant.RestaurantID}">Get more details</a></div>
            `;
            restaurantList.appendChild(listItem);
          });
        } else {
          restaurantList.innerHTML = '<p>No restaurants found.</p>';
        }
      })
      .catch(error => {
        console.error('Error fetching restaurants:', error);
        restaurantList.innerHTML = '<p>Error fetching restaurants.</p>';
      });
  }

  searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const term = searchTerm.value;
    const avgcost = avgcostfor2.value;
    const category = cat.value;
    let url = `/search?category=${category}`;

    if (term) {
      url += `&term=${term}`;
    }

    if (avgcost) {
      url += `&avgcost=${avgcost}`;
    }

    fetch(url)
      .then(response => response.json())
      .then(data => {
        restaurantList.innerHTML = '';
        if (data.length > 0) {
          data.forEach(restaurant => {
            const listItem = document.createElement('div');
            listItem.classList.add('restaurant-item');
            listItem.innerHTML = `
              <div>${restaurant.RestaurantName}, ${restaurant.City}</div>
              <div><a href="/restaurant?id=${restaurant.RestaurantID}">Get more details</a></div>
            `;
            restaurantList.appendChild(listItem);
          });
        } else {
          restaurantList.innerHTML = '<p>No restaurants found.</p>';
        }
      })
      .catch(error => {
        console.error('Error searching for restaurants:', error);
        restaurantList.innerHTML = '<p>Error searching for restaurants.</p>';
      });
  });

  goToPage.addEventListener('click', function() {
    const page = pageNum.value;
    if (page) {
      fetchRestaurants(page);
    }
  });

  fetchRestaurants(currentPage);
});
