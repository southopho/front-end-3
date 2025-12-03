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

    elements.marriage.addEventListener("input", () => {
        update_element_visability();
    });

    const manage_marriage_visability = () => {
        if (GLOBAL_age < 18 || elements.marriage.value === "not-married") {
            document.getElementById("spouce-container").style.display = "none";
        } else {
            document.getElementById("spouce-container").style.display = "block";
        }
    };

    const update_element_visability = () => {
        if (Number(elements.work_experiance.value) > 0) {
            elements.work_field.style.display = "block";
        } else {
            elements.work_field.style.display = "none";
        }
        for (let i = 0; i < 30; i++) {
            document.querySelectorAll(".age-over-" + i).forEach((element) => {
                element.style.display = GLOBAL_age > i ? "block" : "none";
            });
        }
        manage_marriage_visability();

        // if (elements.marriage.value === "married") {
        //     console.log("married");
        //     elements.spouce.style.display = "block";
        // } else {
        //     elements.spouce.style.display = "none";
        // }
    };

    if (elements.birthday.value) {
        GLOBAL_age = calculate_age(new Date(elements.birthday.value));
    }

    update_element_visability();
});
