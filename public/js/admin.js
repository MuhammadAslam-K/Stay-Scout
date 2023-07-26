let months
let ordersByMonth
let revenueByMonth
let orderData


/////////////// Graph data ////////////////////

<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>


if (window.location.pathname === '/admin/dashboard') {
    // Move the Chart rendering code inside the window.onload event listener
    window.onload = function () {
        // Place your existing JavaScript code here
        // ...

        const getChartData = async () => {
            const response = await fetch('/admin/chartData', {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const data = await response.json()

            console.log(data);

            months = data.months
            ordersByMonth = data.ordersByMonth
            revenueByMonth = data.revenueByMonth

            salesGraph(months, ordersByMonth)
            revenue(months, data.revenueByMonth)
        }


        function salesGraph(months, ordersByMonth) {
            const ctx = document.getElementById('myChart');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: months,
                    datasets: [{
                        label: '# of sales',
                        data: ordersByMonth,
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        function revenue(months, revenueByMonth) {
            const ctx1 = document.getElementById('myChart1');
            new Chart(ctx1, {
                type: 'line',
                data: {
                    labels: months,
                    datasets: [{
                        label: '# Revenue',
                        data: revenueByMonth,
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        // Call the getChartData function after the DOM has fully loaded
        getChartData();
    };
}