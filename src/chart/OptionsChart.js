const serie = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310];
export const optionsDay = {

    chart: {
        type: "line",
    },
    responsive: [
        {
            breakpoint: 1440,
            options: {
                chart: {
                    width: 800,
                },
                legend: {
                    position: 'bottom',
                },
            },
        },
    ],

    stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'asasas',
        colors: undefined,
        width: 2,
    },
    labels: serie.map((value, index) => ` ${index + 1}`),
    dataLabels: {
        enabled: true,
        dropShadow: {
            enabled: false,
        },
        style: {
            fontSize: "12px",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: 500,
            colors: undefined,
            foreColor: "#fff",

        },
        offsetX: 0,
        offsetY: 0,

        background: {
            enabled: true,
            foreColor: "#fff",
            padding: "",
            borderRadius: 5,
            borderWidth: 2,
            borderColor: "",
            opacity: 1,
            dropShadow: {
                enabled: false,
                top: 1,
                left: 1,
                blur: 1,
                opacity: 1,
            },
        },

    },

}


