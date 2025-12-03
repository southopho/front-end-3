const ready = (fn) => {
    if (document.readyState !== "loading") {
        fn();
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
};

const calculate_age = (dob) => {
    var diff_ms = Date.now() - dob.getTime();
    var age_dt = new Date(diff_ms);
    return age_dt.getUTCFullYear() - 1970;
};

const gen_PIN = (dob, gender) => {
    let pin = "";
    let year = dob.getFullYear().toString();
    let year_short = year.slice(-2);
    let year_full = dob.getFullYear();
    let month = dob.getMonth() + 1;
    let day = dob.getDate();

    let century;
    if (year_full >= 1800 && year_full <= 1899) {
        century = 19;
    } else if (year_full >= 1900 && year_full <= 1999) {
        century = 20;
    } else if (year_full >= 2000 && year_full <= 2099) {
        century = 21;
    }

    if (century === 19) {
        pin += gender === "male" ? "1" : "2";
    } else if (century === 20) {
        pin += gender === "male" ? "3" : "4";
    } else if (century === 21) {
        pin += gender === "male" ? "5" : "6";
    }

    pin += year_short;
    pin += month.toString().padStart(2, "0");
    pin += day.toString().padStart(2, "0");

    return pin;
};

ready(() => {
    // Variables

    let elements = {
        gender: document.getElementById("gender"),
        first_name: document.getElementById("first-name"),
        second_name: document.getElementById("second-name"),
        last_name: document.getElementById("last-name"),
        birthday: document.getElementById("birthday"),
        pin: document.getElementById("pin"),
        education: document.getElementById("education"),
        phone_num: document.getElementById("phone-num"),
        email: document.getElementById("email"),
        address: document.getElementById("address"),
        marriage: document.getElementById("marriage"),
        spouce: document.getElementById("spouce"),
        occupational_status: document.getElementById("occupational-status"),
        work_experiance: document.getElementById("work-experiance"),
        work_field: document.getElementById("work-field"),
    };

    let GLOBAL_age = 0;

    // Event listeners

    elements.phone_num.addEventListener("keypress", (event) => {
        let symbol = event.key;
        let regex = /^([\+\ \d-()])?$/;
        if (!regex.test(symbol)) {
            event.preventDefault();
        }
    });

    elements.work_experiance.addEventListener("keypress", (event) => {
        let symbol = event.key;
        let regex = /^(\d)?$/;
        if (!regex.test(symbol)) {
            event.preventDefault();
        }

        if (event.target.value.length >= 2 && symbol !== "Backspace") {
            event.preventDefault();
        }
    });

    elements.work_experiance.addEventListener("input", () => {
        update_element_visability();
    });

    elements.birthday.addEventListener("input", (event) => {
        GLOBAL_age = calculate_age(new Date(event.target.value));

        update_PIN();
        update_element_visability();
    });

    elements.gender.addEventListener("input", () => {
        update_PIN();
    });

    elements.marriage.addEventListener("input", () => {
        update_element_visability();
    });

    elements.pin.addEventListener("input", (event) => {
        event.target.value = event.target.value.replace(/\D/g, "").slice(0, 11);
    });

    // Functions

    const manage_marriage_visability = () => {
        if (GLOBAL_age < 18 || elements.marriage.value === "not-married") {
            document.getElementById("spouce-container").style.display = "none";
        } else {
            document.getElementById("spouce-container").style.display = "block";
        }
    };

    const update_PIN = () => {
        elements.pin.value = gen_PIN(
            new Date(elements.birthday.value),
            elements.gender.value
        );
    };

    const update_element_visability = () => {
        for (let i = 0; i < 30; i++) {
            document.querySelectorAll(".age-over-" + i).forEach((element) => {
                element.style.display = GLOBAL_age > i ? "block" : "none";
            });
        }

        if (Number(elements.work_experiance.value) > 0) {
            elements.work_field.style.display = "block";
        } else {
            elements.work_field.style.display = "none";
        }
        manage_marriage_visability();
    };

    // Initial setup

    if (elements.birthday.value) {
        GLOBAL_age = calculate_age(new Date(elements.birthday.value));
    }

    update_element_visability();
});
