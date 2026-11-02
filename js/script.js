
document.addEventListener("DOMContentLoaded", () => {

    // ========================================
    // FAQ ACCORDION
    // ========================================

    const questions = document.querySelectorAll(".faq-question");

    questions.forEach((question) => {
        question.addEventListener("click", () => {
            const answer = document.getElementById(
                question.getAttribute("aria-controls")
            );

            if (!answer) return;

            const expanded =
                question.getAttribute("aria-expanded") === "true";

            question.setAttribute(
                "aria-expanded",
                String(!expanded)
            );

            answer.hidden = expanded;

            const icon = question.querySelector(".faq-icon");

            if (icon) {
                icon.textContent = expanded ? "+" : "−";
            }
        });
    });


    // ========================================
    // IMAGE GALLERY LIGHTBOX
    // ========================================

    const galleryItems = document.querySelectorAll(".gallery-item");
    const lightbox = document.getElementById("image-lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const closeButton = document.querySelector(".lightbox-close");

    if (
        galleryItems.length &&
        lightbox &&
        lightboxImage &&
        lightboxCaption &&
        closeButton
    ) {
        let previousFocus = null;

        function closeLightbox() {
            lightbox.hidden = true;
            document.body.classList.remove("lightbox-open");

            lightboxImage.removeAttribute("src");
            lightboxImage.alt = "";
            lightboxCaption.textContent = "";

            if (previousFocus) {
                previousFocus.focus();
            }
        }

        galleryItems.forEach((item) => {
            item.addEventListener("click", () => {
                const image = item.querySelector("img");

                if (!image) return;

                previousFocus = document.activeElement;

                lightboxImage.src = image.src;
                lightboxImage.alt = image.alt;
                lightboxCaption.textContent = image.alt;

                lightbox.hidden = false;
                document.body.classList.add("lightbox-open");

                closeButton.focus();
            });
        });

        closeButton.addEventListener("click", closeLightbox);

        lightbox.addEventListener("click", (event) => {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (lightbox.hidden) return;

            if (event.key === "Escape") {
                closeLightbox();
            }

            if (event.key === "Tab") {
                event.preventDefault();
                closeButton.focus();
            }
        });
    }


    // ========================================
    // SHARED FORM VALIDATION HELPERS
    // ========================================

    function showError(field, errorMessage) {
        const errorElement = document.getElementById(
            `${field.id}-error`
        );

        field.setAttribute("aria-invalid", "true");

        if (errorElement) {
            errorElement.textContent = errorMessage;
        }
    }

    function clearError(field) {
        const errorElement = document.getElementById(
            `${field.id}-error`
        );

        field.removeAttribute("aria-invalid");

        if (errorElement) {
            errorElement.textContent = "";
        }
    }

    function validateField(field, type) {
        const value = field.value.trim();

        clearError(field);

        if (type === "name") {
            if (value.length < 2 || value.length > 100) {
                showError(
                    field,
                    "Please enter your full name (2–100 characters)."
                );
                return false;
            }
        }

        if (type === "email") {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (
                !emailPattern.test(value) ||
                value.length > 254
            ) {
                showError(
                    field,
                    "Please enter a valid email address."
                );
                return false;
            }
        }

        if (type === "phone" && value !== "") {
            const digits = value.replace(/\D/g, "");

            if (
                digits.length < 9 ||
                digits.length > 15 ||
                value.length > 20 ||
                !/^[+()\d\s-]+$/.test(value)
            ) {
                showError(
                    field,
                    "Please enter a valid phone number."
                );
                return false;
            }
        }

        if (type === "select" && value === "") {
            showError(
                field,
                "Please select an option."
            );
            return false;
        }

        if (type === "message") {
            if (value.length < 10 || value.length > 1000) {
                showError(
                    field,
                    "Please enter a message between 10 and 1000 characters."
                );
                return false;
            }
        }

        return true;
    }

    function setupFieldValidation(fieldRules, statusElement, onEdit) {
        fieldRules.forEach(({ field, type }) => {
            if (!field) return;

            field.addEventListener("blur", () => {
                validateField(field, type);
            });

            function handleEdit() {
                if (
                    field.getAttribute("aria-invalid") === "true"
                ) {
                    validateField(field, type);
                }

                if (statusElement) {
                    statusElement.textContent = "";
                    statusElement.className = "form-status";
                }

                if (onEdit) {
                    onEdit();
                }
            }

            field.addEventListener("input", handleEdit);
            field.addEventListener("change", handleEdit);
        });
    }

    function validateForm(fieldRules) {
        let firstInvalidField = null;

        fieldRules.forEach(({ field, type }) => {
            if (
                field &&
                !validateField(field, type) &&
                !firstInvalidField
            ) {
                firstInvalidField = field;
            }
        });

        if (firstInvalidField) {
            firstInvalidField.focus();
            return false;
        }

        return true;
    }

    async function submitForm(form, data) {
        const response = await fetch(form.action, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.error || "Submission failed."
            );
        }

        return result;
    }


    // ========================================
    // QUESTION 4.1 - ENQUIRY FORM
    // ========================================

    const enquiryForm = document.getElementById(
        "contact-enquiry-form"
    );

    if (enquiryForm) {
        const fullName = document.getElementById("full-name");
        const email = document.getElementById("email");
        const phone = document.getElementById("phone");
        const enquiryType = document.getElementById("enquiry-type");
        const message = document.getElementById("message");
        const formStatus = document.getElementById("form-status");

        const fieldRules = [
            { field: fullName, type: "name" },
            { field: email, type: "email" },
            { field: phone, type: "phone" },
            { field: enquiryType, type: "select" },
            { field: message, type: "message" }
        ];

        setupFieldValidation(fieldRules, formStatus);

        enquiryForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            if (!validateForm(fieldRules)) {
                formStatus.textContent =
                    "Please correct the highlighted fields before continuing.";

                formStatus.className =
                    "form-status form-status-error";

                return;
            }

            const data = {
                fullName: fullName.value.trim(),
                email: email.value.trim(),
                phone: phone.value.trim(),
                enquiryType: enquiryType.value,
                message: message.value.trim()
            };

            const button = enquiryForm.querySelector(
                'button[type="submit"]'
            );

            button.disabled = true;
            button.textContent = "Submitting...";

            formStatus.textContent = "Processing your enquiry...";
            formStatus.className =
                "form-status form-status-info";

            try {
                const result = await submitForm(
                    enquiryForm,
                    data
                );

                formStatus.textContent =
                    result.message +
                    " Reference number: " +
                    result.enquiryId +
                    ". This is a local demonstration; no email has been sent.";

                formStatus.className =
                    "form-status form-status-success";

                enquiryForm.reset();
                fieldRules.forEach(({ field }) => {
                    clearError(field);
                });

            } catch (error) {
                formStatus.textContent =
                    "Submission failed: " + error.message;

                formStatus.className =
                    "form-status form-status-error";

            } finally {
                button.disabled = false;
                button.textContent = "Submit Enquiry";
            }
        });
    }


    // ========================================
    // QUESTION 4.2 - GENERAL CONTACT FORM
    // ========================================

    const contactForm = document.getElementById(
        "general-contact-form"
    );

    if (contactForm) {
        const fullName = document.getElementById(
            "contact-full-name"
        );

        const email = document.getElementById(
            "contact-email"
        );

        const phone = document.getElementById(
            "contact-phone"
        );

        const messageType = document.getElementById(
            "contact-message-type"
        );

        const message = document.getElementById(
            "contact-message"
        );

        const formStatus = document.getElementById(
            "contact-form-status"
        );

        const emailLink = document.getElementById(
            "contact-email-link"
        );

        const fieldRules = [
            { field: fullName, type: "name" },
            { field: email, type: "email" },
            { field: phone, type: "phone" },
            { field: messageType, type: "select" },
            { field: message, type: "message" }
        ];

        setupFieldValidation(
            fieldRules,
            formStatus,
            () => {
                if (emailLink) {
                    emailLink.hidden = true;
                    emailLink.removeAttribute("href");
                }
            }
        );

        contactForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            if (emailLink) {
                emailLink.hidden = true;
                emailLink.removeAttribute("href");
            }

            if (!validateForm(fieldRules)) {
                formStatus.textContent =
                    "Please correct the highlighted fields before continuing.";

                formStatus.className =
                    "form-status form-status-error";

                return;
            }

            const data = {
                fullName: fullName.value.trim(),
                email: email.value.trim(),
                phone: phone.value.trim(),
                messageType: messageType.value,
                message: message.value.trim()
            };

            const button = contactForm.querySelector(
                'button[type="submit"]'
            );

            button.disabled = true;
            button.textContent = "Submitting...";

            formStatus.textContent =
                "Saving your contact message...";

            formStatus.className =
                "form-status form-status-info";

            try {
                const result = await submitForm(
                    contactForm,
                    data
                );

                const selectedOption =
                    messageType.options[messageType.selectedIndex];

                const typeLabel = selectedOption.textContent.trim();

                const subject =
                    "Tshinakaho Haven - " + typeLabel;

                const emailBody = [
                    "Contact Message",
                    "",
                    "Full Name: " + data.fullName,
                    "Email: " + data.email,
                    "Phone: " + (data.phone || "Not provided"),
                    "Message Type: " + typeLabel,
                    "",
                    "Message:",
                    data.message,
                    "",
                    "Local Reference Number: " + result.messageId
                ].join("\n");

                const mailtoURL =
                    "mailto:info@tshinakahohaven.org.za" +
                    "?subject=" + encodeURIComponent(subject) +
                    "&body=" + encodeURIComponent(emailBody);

                if (emailLink) {
                    emailLink.href = mailtoURL;
                    emailLink.hidden = false;
                }

                formStatus.textContent =
                    result.message +
                    " Reference number: " +
                    result.messageId +
                    ". No email has been sent automatically.";

                formStatus.className =
                    "form-status form-status-success";

                contactForm.reset();

                fieldRules.forEach(({ field }) => {
                    clearError(field);
                });

            } catch (error) {
                formStatus.textContent =
                    "Submission failed: " + error.message;

                formStatus.className =
                    "form-status form-status-error";

            } finally {
                button.disabled = false;
                button.textContent = "Submit Message";
            }
        });
    }


    // ========================================
    // INTERACTIVE LEAFLET MAP
    // ========================================

    const mapContainer = document.getElementById(
        "interactive-map"
    );

    if (mapContainer) {
        if (typeof L !== "undefined") {
            const mapCoordinates = [-25.9992, 28.1263];

            const map = L.map("interactive-map").setView(
                mapCoordinates,
                12
            );

            L.tileLayer(
                "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                {
                    attribution:
                        '&copy; <a href="https://www.openstreetmap.org/copyright">' +
                        'OpenStreetMap</a> contributors',
                    maxZoom: 19
                }
            ).addTo(map);

            L.circle(mapCoordinates, {
                radius: 2500,
                color: "#24A096",
                fillColor: "#24A096",
                fillOpacity: 0.12,
                weight: 2
            })
            .addTo(map)
            .bindPopup(
                "<strong>Illustrative Midrand Area</strong><br>" +
                "The exact proposed Tshinakaho Haven site is not verified."
            );

            setTimeout(() => {
                map.invalidateSize();
            }, 100);

        } else {
            mapContainer.textContent =
                "The interactive map could not be loaded. " +
                "Please check your internet connection.";
        }
    }


    // ========================================
    // DYNAMIC SERVICES SEARCH AND SORT
    // ========================================

    const servicesContainer = document.getElementById(
        "dynamic-services"
    );

    const serviceSearch = document.getElementById(
        "service-search"
    );

    const serviceSearchForm = document.getElementById(
        "services-search-form"
    );

    const serviceSort = document.getElementById(
        "service-sort"
    );

    const serviceResultCount = document.getElementById(
        "services-result-count"
    );

    const serviceEmpty = document.getElementById(
        "services-empty"
    );

    const servicesResults = document.getElementById(
        "services-results"
    );

    if (
        servicesContainer &&
        serviceSearch &&
        serviceSearchForm &&
        serviceSort &&
        serviceResultCount &&
        serviceEmpty
    ) {
        const services = [
            {
                number: "01",
                name: "Safe Accommodation",
                description:
                    "A safe, stable and comfortable place where " +
                    "children can feel protected, supported and at home."
            },
            {
                number: "02",
                name: "Food & Nutrition",
                description:
                    "Nutritious meals that support children's " +
                    "health, development and overall wellbeing."
            },
            {
                number: "03",
                name: "Educational Support",
                description:
                    "School supplies, homework assistance, " +
                    "learning resources and a suitable space for studying."
            },
            {
                number: "04",
                name: "Clothing & Personal Care",
                description:
                    "Providing everyday clothing and personal " +
                    "care essentials while promoting dignity and wellbeing."
            },
            {
                number: "05",
                name: "Emotional Support",
                description:
                    "A caring environment where children feel " +
                    "heard, respected, valued and supported."
            },
            {
                number: "06",
                name: "Recreation & Life Skills",
                description:
                    "Opportunities to play, build relationships " +
                    "and develop practical skills for greater independence."
            }
        ];

        function renderServices() {
            const searchTerm =
                serviceSearch.value.trim().toLowerCase();

            const sortOrder = serviceSort.value;

            const filteredServices = services.filter((service) => {
                const name = service.name.toLowerCase();
                const description = service.description.toLowerCase();

                return (
                    name.includes(searchTerm) ||
                    description.includes(searchTerm)
                );
            });

            if (sortOrder === "az") {
                filteredServices.sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
            } else if (sortOrder === "za") {
                filteredServices.sort((a, b) =>
                    b.name.localeCompare(a.name)
                );
            }

            servicesContainer.replaceChildren();

            filteredServices.forEach((service) => {
                const card = document.createElement("article");
                card.className = "service-cue-card";

                const number = document.createElement("span");
                number.className = "service-number";
                number.textContent = service.number;

                const heading = document.createElement("h3");
                heading.textContent = service.name;

                const description = document.createElement("p");
                description.textContent = service.description;

                const hint = document.createElement("span");
                hint.className = "card-hint";

                if (service.number === "01") {
                    hint.textContent = "Swipe to explore →";
                } else if (service.number === "06") {
                    hint.textContent = "Get involved ↓";
                } else {
                    hint.textContent = "Keep exploring →";
                }

                card.append(
                    number,
                    heading,
                    description,
                    hint
                );

                servicesContainer.appendChild(card);
            });

            const count = filteredServices.length;

            serviceResultCount.textContent =
                `${count} ${count === 1 ? "service" : "services"} found`;

            serviceEmpty.hidden = count !== 0;
            servicesContainer.scrollLeft = 0;
        }

        serviceSearch.addEventListener(
            "input",
            renderServices
        );

        serviceSearchForm.addEventListener("submit", (event) => {
            event.preventDefault();
            renderServices();

            if (servicesResults) {
                const reducedMotion = window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches;

                servicesResults.scrollIntoView({
                    behavior: reducedMotion ? "auto" : "smooth",
                    block: "start"
                });
            }
        });

        serviceSort.addEventListener(
            "change",
            renderServices
        );

        renderServices();
    }


    // ========================================
    // SOCIAL MEDIA SHARING
    // ========================================

    const whatsappLink = document.getElementById(
        "share-whatsapp"
    );

    const facebookLink = document.getElementById(
        "share-facebook"
    );

    if (whatsappLink || facebookLink) {
        const websiteURL = window.location.href;

        const shareMessage =
            "Learn about Tshinakaho Haven, " +
            "a proposed children's home in South Africa.";

        if (whatsappLink) {
            whatsappLink.href =
                "https://api.whatsapp.com/send?text=" +
                encodeURIComponent(
                    shareMessage + " " + websiteURL
                );
        }

        if (facebookLink) {
            facebookLink.href =
                "https://www.facebook.com/sharer/sharer.php?u=" +
                encodeURIComponent(websiteURL);
        }
    }

});
