const servicesList = document.querySelectorAll('.services');
    const serviceLocationList = document.querySelectorAll('.service-location');
    const certificationList = document.querySelectorAll('.certification');
        
    servicesList.forEach((element) => {
        if (trainer.services.includes(element.value)) {
            element.checked = true;
        }
    })

    serviceLocationList.forEach((element) => {
        if (trainer.serviceLocation.includes(element.value)) {
            element.checked = true;
        }
    })

    certificationList.forEach((element) => {
        if (trainer.certification.includes(element.value)) {
            element.checked = true;
        }
    })