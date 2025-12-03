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
    return Math.abs(age_dt.getUTCFullYear() - 1970);
};

ready(() => {
    let elements = {
        gender: document.getElementById("gender"),
        first_name: document.getElementById("first-name"),
        second_name: document.getElementById("second-name"),
        last_name: document.getElementById("last-name"),
        birthday: document.getElementById("birthday"),
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
        update_element_visability();
    });

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
    };

    GLOBAL_age = calculate_age(new Date(elements.birthday.value));
    update_element_visability();
});
