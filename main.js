const ready = (fn) => {
    if (document.readyState !== "loading") {
        fn();
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
};

const num_validator = (value, length = 0) => {
    if (value === "") {
        return false;
    }
    if (length === 0) {
        length = value.length;
    }
    let regex = new RegExp("^\\d{" + length + "}$");
    return regex.test(value);
};

const phone_validator = (value) => {
    let regex =
        /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
    return regex.test(value);
};

// Source - https://stackoverflow.com/a
// Posted by John Rutherford, modified by community. See post 'Timeline' for change history
// Retrieved 2025-12-09, License - CC BY-SA 4.0

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
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

    if (isNaN(year)) {
        return "";
    }
    if (gender === "N/A") {
        return "";
    }

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

    let current_part = 1;

    let elements = {
        // first part
        gender: document.getElementById("gender"),
        first_name: document.getElementById("first-name"),
        second_name: document.getElementById("second-name"),
        last_name: document.getElementById("last-name"),
        birthday: document.getElementById("birthday"),
        pin: document.getElementById("pin"),
        // second part
        education: document.getElementById("education"),
        educational_institution: document.getElementById(
            "educational-institution"
        ),
        year_of_graduation: document.getElementById("year-of-graduation"),
        qualification: document.getElementById("qualification"),
        degree: document.getElementById("degree"),
        phone_num: document.getElementById("phone-num"),
        email: document.getElementById("email"),
        address: document.getElementById("address"),
        // third part
        marriage: document.getElementById("marriage"),
        spouce: document.getElementById("spouce"),
        occupational_status: document.getElementById("occupational-status"),
        study_level: document.getElementById("study-level"),
        course_of_study: document.getElementById("course-of-study"),
        expected_graduation_year: document.getElementById(
            "expected-graduation-year"
        ),
        workplace: document.getElementById("workplace"),
        position: document.getElementById("position"),
        reason_for_unemployment: document.getElementById(
            "reason-for-unemployment"
        ),
        end_of_vacation: document.getElementById("end-of-vacation"),
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

    elements.course_of_study.addEventListener("keypress", (event) => {
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

        elements.year_of_graduation.min =
            new Date(event.target.value).getFullYear() + 12;

        elements.occupational_status.value = "N/A";

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

    document.addEventListener("input", () => {
        update_element_visability();
    });

    const next_buttons = document.getElementsByClassName("next-btn");
    for (let next_button of next_buttons) {
        next_button.addEventListener("click", (event) => {
            if (validator()) {
                current_part += 1;
                update_element_visability();
            }
        });
    }

    const prev_buttons = document.getElementsByClassName("prev-btn");
    for (let prev_button of prev_buttons) {
        prev_button.addEventListener("click", (event) => {
            current_part -= 1;
            update_element_visability();
        });
    }

    // Functions
    const manage_marriage_visability = () => {
        if (GLOBAL_age > 18 && elements.marriage.value === "married") {
            document.getElementById("spouce-container").style.display = "grid";
        } else {
            document.getElementById("spouce-container").style.display = "none";
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
                element.style.display = GLOBAL_age > i ? "grid" : "none";
            });
        }

        if (Number(elements.work_experiance.value) > 0) {
            document.getElementById("work-field-elements").style.display =
                "grid";
        } else {
            document.getElementById("work-field-elements").style.display =
                "none";
        }
        manage_marriage_visability();

        if (
            elements.education.value === "primary-ed" ||
            elements.education.value === "secondary-ed" ||
            elements.education.value === "N/A"
        ) {
            document.getElementById("qualification-container").style.display =
                "none";
        } else {
            document.getElementById("qualification-container").style.display =
                "grid";
        }

        if (
            elements.education.value === "college-ed" ||
            elements.education.value === "university-ed"
        ) {
            document.getElementById("degree-container").style.display = "grid";
        } else {
            document.getElementById("degree-container").style.display = "none";
        }

        if (elements.occupational_status.value === "studying") {
            document.getElementById("studying-container").style.display =
                "grid";
        } else {
            document.getElementById("studying-container").style.display =
                "none";
        }

        if (elements.occupational_status.value === "working") {
            document.getElementById("workplace-container").style.display =
                "grid";
        } else {
            document.getElementById("workplace-container").style.display =
                "none";
        }

        if (elements.occupational_status.value === "not-working") {
            document.getElementById("unemployment-container").style.display =
                "grid";
        } else {
            document.getElementById("unemployment-container").style.display =
                "none";
        }

        if (elements.occupational_status.value === "vacation") {
            document.getElementById("vacation-container").style.display =
                "grid";
        } else {
            document.getElementById("vacation-container").style.display =
                "none";
        }

        document.getElementById("first-part").style.display =
            current_part === 1 ? "grid" : "none";
        document.getElementById("second-part").style.display =
            current_part === 2 ? "grid" : "none";
        document.getElementById("third-part").style.display =
            current_part === 3 ? "grid" : "none";
        document.getElementById("fourth-part").style.display =
            current_part === 4 ? "grid" : "none";

        let form_result = {};
        for (const [key, element] of Object.entries(elements)) {
            form_result[key] = element.value;
            // console.log(`${key}: ${element.value}`);
        }
        document.getElementById("result").innerText =
            JSON.stringify(form_result);
    };

    const validator = () => {
        let isValid = true;
        if (current_part === 1) {
            if (elements.gender.value === "N/A") {
                elements.gender.classList.add("error");
                isValid = false;
            } else {
                elements.gender.classList.remove("error");
            }

            if (elements.first_name.value.trim() === "") {
                elements.first_name.classList.add("error");
                isValid = false;
            } else {
                elements.first_name.classList.remove("error");
            }

            if (elements.last_name.value.trim() === "") {
                elements.last_name.classList.add("error");
                isValid = false;
            } else {
                elements.last_name.classList.remove("error");
            }

            if (elements.birthday.value === "") {
                elements.birthday.classList.add("error");
                isValid = false;
            } else {
                elements.birthday.classList.remove("error");
            }

            if (!num_validator(elements.pin.value, 11)) {
                elements.pin.classList.add("error");
                isValid = false;
            } else {
                elements.pin.classList.remove("error");
            }
        } else if (current_part === 2) {
            if (elements.education.value === "N/A") {
                elements.education.classList.add("error");
                isValid = false;
            } else {
                elements.education.classList.remove("error");
            }

            if (elements.educational_institution.value.trim() === "") {
                elements.educational_institution.classList.add("error");
                isValid = false;
            } else {
                elements.educational_institution.classList.remove("error");
            }

            if (!num_validator(elements.year_of_graduation.value)) {
                elements.year_of_graduation.classList.add("error");
                isValid = false;
            } else {
                elements.year_of_graduation.classList.remove("error");
            }

            if (
                GLOBAL_age > 16 &&
                (elements.education.value === "college-ed" ||
                    elements.education.value === "university-ed" ||
                    elements.education.value === "prof-secondary-ed")
            ) {
                if (elements.qualification.value.trim() === "") {
                    elements.qualification.classList.add("error");
                    isValid = false;
                } else {
                    elements.qualification.classList.remove("error");
                }
            }
            if (
                GLOBAL_age > 14 &&
                elements.degree.value === "N/A" &&
                (elements.education.value === "college-ed" ||
                    elements.education.value === "university-ed")
            ) {
                elements.degree.classList.add("error");
                isValid = false;
            } else {
                elements.degree.classList.remove("error");
            }
            if (!phone_validator(elements.phone_num.value)) {
                elements.phone_num.classList.add("error");
                isValid = false;
            } else {
                elements.phone_num.classList.remove("error");
            }

            if (validateEmail(elements.email.value) === null) {
                elements.email.classList.add("error");
                isValid = false;
            } else {
                elements.email.classList.remove("error");
            }

            if (elements.address.value.trim() === "") {
                elements.address.classList.add("error");
                isValid = false;
            } else {
                elements.address.classList.remove("error");
            }
        } else if (current_part === 3) {
            if (GLOBAL_age >= 18) {
                if (elements.marriage.value === "N/A") {
                    elements.marriage.classList.add("error");
                    isValid = false;
                } else {
                    elements.marriage.classList.remove("error");
                }

                if (elements.marriage.value === "married") {
                    if (elements.spouce.value.trim() === "") {
                        elements.spouce.classList.add("error");
                        isValid = false;
                    } else {
                        elements.spouce.classList.remove("error");
                    }
                }
            }

            if (elements.occupational_status.value === "N/A") {
                elements.occupational_status.classList.add("error");
                isValid = false;
            } else {
                elements.occupational_status.classList.remove("error");
            }

            if (elements.occupational_status.value === "studying") {
                if (elements.study_level.value === "N/A") {
                    elements.study_level.classList.add("error");
                    isValid = false;
                } else {
                    elements.study_level.classList.remove("error");
                }

                if (!num_validator(elements.course_of_study.value)) {
                    elements.course_of_study.classList.add("error");
                    isValid = false;
                } else {
                    elements.course_of_study.classList.remove("error");
                }

                if (
                    !num_validator(elements.expected_graduation_year.value) ||
                    elements.expected_graduation_year.value <
                        new Date().getFullYear()
                ) {
                    elements.expected_graduation_year.classList.add("error");
                    isValid = false;
                } else {
                    elements.expected_graduation_year.classList.remove("error");
                }
            } else if (elements.occupational_status.value === "working") {
                if (elements.workplace.value.trim() === "") {
                    elements.workplace.classList.add("error");
                    isValid = false;
                } else {
                    elements.workplace.classList.remove("error");
                }

                if (elements.position.value.trim() === "") {
                    elements.position.classList.add("error");
                    isValid = false;
                } else {
                    elements.position.classList.remove("error");
                }
            } else if (elements.occupational_status.value === "not-working") {
                if (elements.reason_for_unemployment.value.trim() === "") {
                    elements.reason_for_unemployment.classList.add("error");
                    isValid = false;
                } else {
                    elements.reason_for_unemployment.classList.remove("error");
                }
            } else if (elements.occupational_status.value === "vacation") {
                if (elements.end_of_vacation.value === "") {
                    elements.end_of_vacation.classList.add("error");
                    isValid = false;
                } else {
                    elements.end_of_vacation.classList.remove("error");
                }
            }
        }

        return isValid;
    };

    // Initial setup

    elements.expected_graduation_year.min = new Date().getFullYear();

    if (elements.birthday.value) {
        GLOBAL_age = calculate_age(new Date(elements.birthday.value));
    }

    update_element_visability();
});
