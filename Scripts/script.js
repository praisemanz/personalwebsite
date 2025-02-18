document.addEventListener("DOMContentLoaded", () => {

    /* ==============================
       1) CONTACT FORM LOGIC
    ============================== */
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (this.checkValidity()) {
                const name = document.getElementById("name").value;
                const email = document.getElementById("email").value;
                const phone = document.getElementById("phone").value;
                const subject = document.getElementById("subject").value;
                const message = document.getElementById("message").value;

                const bodyContent = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`;
                const isMobile = /Mobi|Android/i.test(navigator.userAgent);

                if (isMobile) {
                    // Open default mail client (mobile)
                    const mailtoUrl = `mailto:praisemanzi@gmail.com?subject=${encodeURIComponent(
                        subject
                    )}&body=${encodeURIComponent(bodyContent)}`;
                    window.location.href = mailtoUrl;
                } else {
                    // Open Gmail in a new window (desktop)
                    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=praisemanzi@gmail.com&su=${encodeURIComponent(
                        subject
                    )}&body=${encodeURIComponent(bodyContent)}`;
                    window.open(gmailUrl, "_blank", "width=800,height=600");
                }
            } else {
                this.reportValidity();
            }
        });
    }
    


    /* ==============================
       2) REVEAL JOURNEY STEPS LOGIC
          (For extracurriculars timeline)
    ============================== */
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }

    function revealJourneySteps() {
        const journeyItems = document.querySelectorAll(
            ".journey-step, .journey-other-lists"
        );
        journeyItems.forEach((item) => {
            if (isInViewport(item)) {
                item.classList.add("active-step");
            }
        });
    }

    window.addEventListener("scroll", revealJourneySteps);
    window.addEventListener("resize", revealJourneySteps);
    revealJourneySteps(); // initial check

    /* ==============================
       3) ACCORDION (EDUCATION) LOGIC
    ============================== */
    const accordionHeaders = document.querySelectorAll(".accordion-header");
    accordionHeaders.forEach((header) => {
        header.addEventListener("click", () => {
            const accordionItem = header.parentElement;
            accordionItem.classList.toggle("active");

            const arrowIcon = header.querySelector(".arrow-icon");
            if (arrowIcon) arrowIcon.classList.toggle("bx-rotate-180");

            const content = accordionItem.querySelector(".accordion-content");
            if (accordionItem.classList.contains("active")) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = 0;
            }
        });
    });

    /* ==============================
       4) INTERACTIVE IMAGE TILT FOR FULL-PAGE SPLASH
    ============================== */
    const homeImgContainer = document.querySelector(".home-img");
    if (homeImgContainer) {
        homeImgContainer.addEventListener("mousemove", (e) => {
            const rect = homeImgContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const midX = rect.width / 2;
            const midY = rect.height / 2;
            const deltaX = (x - midX) / midX; // Range: -1 to 1
            const deltaY = (y - midY) / midY; // Range: -1 to 1

            const tiltX = deltaY * 5; // Adjust tilt strength in degrees
            const tiltY = deltaX * -5;

            homeImgContainer.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            homeImgContainer.classList.add("tilt-active");
        });

        homeImgContainer.addEventListener("mouseleave", () => {
            homeImgContainer.style.transform = "rotateX(0deg) rotateY(0deg)";
            homeImgContainer.classList.remove("tilt-active");
        });
    }

    /* ==============================
       5) DRAG & DROP LOGIC FOR PROJECT CARDS
    ============================== */
    let dragSrcEl = null;

    function handleDragStart(e) {
        dragSrcEl = this;
        this.style.opacity = "0.4"; // Dim element during drag
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/html", this.outerHTML);
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault(); // Necessary to allow drop
        }
        e.dataTransfer.dropEffect = "move";
        return false;
    }

    function handleDragEnter(e) {
        this.classList.add("over"); // Highlight drop target
    }

    function handleDragLeave(e) {
        this.classList.remove("over");
    }

    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation(); // Prevent default behavior
        }
        // Only proceed if the drop target is different from the dragged element.
        if (dragSrcEl !== this) {
            // Remove the source element from its parent
            if (dragSrcEl.parentNode) {
                dragSrcEl.parentNode.removeChild(dragSrcEl);
            }
            // Insert the dragged element's HTML before the current drop target
            let dropHTML = e.dataTransfer.getData("text/html");
            this.insertAdjacentHTML("beforebegin", dropHTML);
            // Get the newly inserted element and attach drag & drop handlers to it.
            let dropElem = this.previousSibling;
            addDnDHandlers(dropElem);
        }
        this.classList.remove("over");
        return false;
    }

    function handleDragEnd(e) {
        this.style.opacity = "1"; // Reset opacity
        // Remove highlighting from all project cards
        document.querySelectorAll(".project-card").forEach((item) =>
            item.classList.remove("over")
        );
    }

    function addDnDHandlers(elem) {
        elem.addEventListener("dragstart", handleDragStart, false);
        elem.addEventListener("dragenter", handleDragEnter, false);
        elem.addEventListener("dragover", handleDragOver, false);
        elem.addEventListener("dragleave", handleDragLeave, false);
        elem.addEventListener("drop", handleDrop, false);
        elem.addEventListener("dragend", handleDragEnd, false);
    }

    // Attach drag-and-drop handlers to all project cards.
    document.querySelectorAll(".project-card").forEach((item) => {
        addDnDHandlers(item);
    });

    // --- Additional: Allow dragging/dropping anywhere in the grid container ---
    const gridContainer = document.querySelector(".project-grid");
    if (gridContainer) {
        gridContainer.addEventListener("dragover", (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
        });
        gridContainer.addEventListener("drop", (e) => {
            e.preventDefault();
            // If drop event occurs on the container (and not on a card), insert at end.
            if (dragSrcEl) {
                dragSrcEl.parentNode.removeChild(dragSrcEl);
                gridContainer.insertAdjacentHTML("beforeend", e.dataTransfer.getData("text/html"));
                let newElem = gridContainer.lastElementChild;
                addDnDHandlers(newElem);
                dragSrcEl = null;
            }
        });
    }
    /* ==============================
      Reverse Scroll Effect for Gallery Columns
   ============================== */
    // Ensure the columns container doesn't expand beyond its height.
    const columnsContainer = document.querySelector(".columns");
    if (columnsContainer) {
        columnsContainer.style.overflowY = "hidden";
    }

    // Check if the ScrollTimeline API is available.
    if ("ScrollTimeline" in window) {
        const timeline = new ScrollTimeline({
            source: document.documentElement,
        });

        // For each reverse column, reverse its order and attach a scroll animation.
        document.querySelectorAll(".column-reverse").forEach(($column) => {
            $column.style.flexDirection = "column-reverse"; // Reverse the flex order.
            $column.animate(
                {
                    transform: [
                        "translateY(calc(-100% + 100vh))",
                        "translateY(calc(100% - 100vh))"
                    ]
                },
                {
                    fill: "both",
                    timeline: timeline
                }
            );
        });
    } else {
        console.warn("ScrollTimeline API is not supported in your browser. Using fallback.");
        document.querySelectorAll(".column-reverse").forEach((column) => {
            column.style.flexDirection = "column-reverse";
        });
        window.addEventListener("scroll", () => {
            const scrollY = window.scrollY;
            document.querySelectorAll(".column-reverse").forEach((column) => {
                // Adjust the factor if necessary
                column.style.transform = `translateY(${-scrollY}px)`;
            });
        });
    }


});
