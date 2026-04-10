document.addEventListener("DOMContentLoaded", () => {
    const MOBILE_WIDTH = 900;
    const currentFile =
        (window.location.pathname.split("/").pop() || "College.html").toLowerCase();
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const nav = document.querySelector("[data-nav]");
    const navToggle = document.querySelector("[data-nav-toggle]");
    const toast = createToast();
    const modal = createModalShell();

    let toastTimer = null;
    let modalCleanup = null;

    const closeAllDropdowns = () => {
        document.querySelectorAll(".dropdown.open").forEach((openDropdown) => {
            openDropdown.classList.remove("open");

            const button = openDropdown.querySelector("[data-dropdown-toggle]");
            if (button instanceof HTMLElement) {
                button.setAttribute("aria-expanded", "false");
            }
        });
    };

    const closeNav = () => {
        if (!(nav && navToggle)) {
            return;
        }

        nav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.textContent = "Menu";
        closeAllDropdowns();
    };

    const showToast = (message) => {
        toast.textContent = message;
        toast.classList.add("show");

        if (toastTimer) {
            window.clearTimeout(toastTimer);
        }

        toastTimer = window.setTimeout(() => {
            toast.classList.remove("show");
        }, 2800);
    };

    const closeModal = () => {
        if (!modal.classList.contains("open")) {
            return;
        }

        modal.classList.remove("open");
        document.body.classList.remove("modal-open");

        if (modalCleanup) {
            modalCleanup();
            modalCleanup = null;
        }
    };

    const openModal = ({ title, subtitle, content, onOpen }) => {
        if (modal.classList.contains("open")) {
            closeModal();
        }

        const titleNode = modal.querySelector("#site-modal-title");
        const subtitleNode = modal.querySelector(".site-modal-subtitle");
        const bodyNode = modal.querySelector(".site-modal-body");
        const closeButton = modal.querySelector(".site-modal-close");

        if (!(
            titleNode instanceof HTMLElement &&
            subtitleNode instanceof HTMLElement &&
            bodyNode instanceof HTMLElement &&
            closeButton instanceof HTMLButtonElement
        )) {
            return;
        }

        titleNode.textContent = title;
        subtitleNode.textContent = subtitle || "";
        bodyNode.innerHTML = "";

        if (content instanceof HTMLElement) {
            bodyNode.appendChild(content);
        } else {
            bodyNode.innerHTML = content;
        }

        const handleOverlayClick = (event) => {
            if (event.target === modal) {
                closeModal();
            }
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                closeModal();
            }
        };

        const handleCloseClick = () => {
            closeModal();
        };

        modal.addEventListener("click", handleOverlayClick);
        document.addEventListener("keydown", handleEscape);
        closeButton.addEventListener("click", handleCloseClick);

        modalCleanup = () => {
            modal.removeEventListener("click", handleOverlayClick);
            document.removeEventListener("keydown", handleEscape);
            closeButton.removeEventListener("click", handleCloseClick);
        };

        modal.classList.add("open");
        document.body.classList.add("modal-open");
        closeButton.focus();

        if (typeof onOpen === "function") {
            onOpen();
        }
    };

    const saveSubmission = (key, payload) => {
        try {
            const raw = localStorage.getItem(key);
            const parsed = raw ? JSON.parse(raw) : [];
            const safePayload = {
                ...payload,
                submittedAt: new Date().toISOString(),
            };

            const next = Array.isArray(parsed) ? parsed : [];
            next.push(safePayload);
            localStorage.setItem(key, JSON.stringify(next.slice(-50)));
        } catch (error) {
            // Local storage can fail in private contexts, so fallback to in-memory behavior.
        }
    };

    const openLoginModal = (role) => {
        const form = document.createElement("form");
        form.className = "site-form";
        form.innerHTML = `
            <label>
                <span>${role} ID or Email</span>
                <input type="text" name="identifier" required autocomplete="username" placeholder="Enter your ID or email">
            </label>
            <label>
                <span>Password</span>
                <input type="password" name="password" required autocomplete="current-password" minlength="6" placeholder="Enter password">
            </label>
            <p class="site-form-note">This is a static demo flow. Credentials are not sent to any server.</p>
            <p class="site-form-status" aria-live="polite"></p>
            <button type="submit">Continue</button>
        `;

        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const statusNode = form.querySelector(".site-form-status");
            const identifier = form.elements.identifier.value.trim();
            const password = form.elements.password.value.trim();

            if (!identifier || password.length < 6) {
                if (statusNode instanceof HTMLElement) {
                    statusNode.textContent = "Please provide a valid ID and password.";
                }
                return;
            }

            saveSubmission("collegeSiteLogins", {
                role,
                identifier,
            });

            closeModal();
            showToast(`${role} login captured successfully.`);
        });

        openModal({
            title: `${role} Login`,
            subtitle: "Secure sign-in demonstration for static website mode",
            content: form,
            onOpen: () => {
                const firstInput = form.querySelector("input[name='identifier']");
                if (firstInput instanceof HTMLInputElement) {
                    firstInput.focus();
                }
            },
        });
    };

    const openAdmissionModal = (sourceLabel) => {
        const form = document.createElement("form");
        form.className = "site-form";
        form.innerHTML = `
            <label>
                <span>Full Name</span>
                <input type="text" name="fullName" required placeholder="Enter your full name">
            </label>
            <label>
                <span>Email</span>
                <input type="email" name="email" required placeholder="name@example.com">
            </label>
            <label>
                <span>Phone Number</span>
                <input type="tel" name="phone" required minlength="10" pattern="[0-9+\-\s]{10,}" placeholder="Enter your phone number">
            </label>
            <label>
                <span>Program of Interest</span>
                <select name="program" required>
                    <option value="">Choose a program</option>
                    <option>B.Tech - Biomedical Engineering</option>
                    <option>B.Tech - Civil Engineering</option>
                    <option>B.Tech - Computer Science Engineering</option>
                    <option>B.Tech - Electronics and Communication Engineering</option>
                    <option>B.Tech - Electrical and Electronics Engineering</option>
                    <option>B.Tech - Mechanical Engineering</option>
                    <option>B.Tech - Mining Engineering</option>
                    <option>Master of Computer Applications</option>
                </select>
            </label>
            <label>
                <span>Message</span>
                <textarea name="message" rows="3" placeholder="Any specific questions"></textarea>
            </label>
            <p class="site-form-note">Form submission is stored in your browser for demo purposes only.</p>
            <p class="site-form-status" aria-live="polite"></p>
            <button type="submit">Submit Enquiry</button>
        `;

        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const statusNode = form.querySelector(".site-form-status");
            const data = new FormData(form);
            const fullName = String(data.get("fullName") || "").trim();
            const email = String(data.get("email") || "").trim();
            const phone = String(data.get("phone") || "").trim();
            const program = String(data.get("program") || "").trim();

            if (!fullName || !email || !phone || !program) {
                if (statusNode instanceof HTMLElement) {
                    statusNode.textContent = "Please complete all required fields.";
                }
                return;
            }

            saveSubmission("collegeSiteEnquiries", {
                source: sourceLabel,
                fullName,
                email,
                phone,
                program,
                message: String(data.get("message") || "").trim(),
            });

            closeModal();
            showToast("Your enquiry has been submitted successfully.");
        });

        openModal({
            title: "Admission and Career Enquiry",
            subtitle: `Initiated from: ${sourceLabel}`,
            content: form,
            onOpen: () => {
                const firstInput = form.querySelector("input[name='fullName']");
                if (firstInput instanceof HTMLInputElement) {
                    firstInput.focus();
                }
            },
        });
    };

    const openNoticeModal = (noticeText) => {
        const card = document.createElement("div");
        card.className = "notice-preview";
        card.innerHTML = `
            <p>${noticeText}</p>
            <p>Please contact the department office for official circular documents.</p>
        `;

        openModal({
            title: "Notice Information",
            subtitle: "Announcement preview",
            content: card,
        });
    };

    const openPolicyModal = (type) => {
        const policyCard = document.createElement("div");
        policyCard.className = "notice-preview";

        if (type === "privacy") {
            policyCard.innerHTML = `
                <p>This static site collects no server-side personal data.</p>
                <p>Form entries are stored locally in your browser only for demo interactions.</p>
            `;
        } else {
            policyCard.innerHTML = `
                <p>All information displayed is for institutional demonstration purposes.</p>
                <p>Program details, schedules, and notices are subject to official announcements.</p>
            `;
        }

        openModal({
            title: type === "privacy" ? "Privacy Policy" : "Terms and Conditions",
            subtitle: "Static website policy summary",
            content: policyCard,
        });
    };

    const setExternalLink = (link, url) => {
        link.setAttribute("href", url);
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
    };

    const enhancePlaceholderLinks = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phonePattern = /^[+]?[- 0-9]{10,}$/;
        const socialMap = {
            facebook: "https://www.facebook.com/",
            twitter: "https://x.com/",
            instagram: "https://www.instagram.com/",
            linkedin: "https://www.linkedin.com/",
        };

        const internalLinkMap = [
            { keyword: "programs", href: "Academics.html#programs" },
            { keyword: "examinations", href: "Academics.html#examinations" },
            { keyword: "examination", href: "Academics.html#examinations" },
            { keyword: "library", href: "CampusLife.html#library" },
            { keyword: "scholarship", href: "Academics.html#scholarships" },
            { keyword: "recruiter guidelines", href: "Resources.html#recruiters" },
            { keyword: "student handbook", href: "Resources.html#handbook" },
            { keyword: "student portal", href: "Resources.html#student-services" },
            { keyword: "faculty portal", href: "Resources.html#faculty-services" },
            { keyword: "news & events", href: "CampusLife.html#campus-events" },
            { keyword: "news events", href: "CampusLife.html#campus-events" },
            { keyword: "alumni", href: "CampusLife.html#alumni-network" },
            { keyword: "careers", href: "Placement.html#placement-stats" },
            { keyword: "downloads", href: "Resources.html#downloads" },
            { keyword: "resources", href: "Resources.html#downloads" },
            { keyword: "campus life", href: "CampusLife.html" },
            { keyword: "academics", href: "Academics.html" },
        ];

        document.querySelectorAll("a[href='#']").forEach((link) => {
            const label = (link.textContent || "").trim();
            const lowerLabel = label.toLowerCase();

            if (!label) {
                return;
            }

            if (emailPattern.test(label)) {
                link.setAttribute("href", `mailto:${label.toLowerCase()}`);
                return;
            }

            if (phonePattern.test(label)) {
                const number = label.replace(/[^0-9+]/g, "");
                link.setAttribute("href", `tel:${number}`);
                return;
            }

            if (Object.prototype.hasOwnProperty.call(socialMap, lowerLabel)) {
                setExternalLink(link, socialMap[lowerLabel]);
                return;
            }

            if (
                lowerLabel.includes("campus location") ||
                lowerLabel.includes("campus map") ||
                lowerLabel.includes("location")
            ) {
                setExternalLink(link, "https://maps.google.com/?q=College+of+Engineering+Campus");
                return;
            }

            const mappedLink = internalLinkMap.find((entry) => lowerLabel.includes(entry.keyword));
            if (mappedLink) {
                link.setAttribute("href", mappedLink.href);
                return;
            }

            if (lowerLabel.includes("apply") || lowerLabel.includes("career portal")) {
                link.addEventListener("click", (event) => {
                    event.preventDefault();
                    openAdmissionModal(label);
                });
                return;
            }

            if (lowerLabel.includes("privacy policy")) {
                link.addEventListener("click", (event) => {
                    event.preventDefault();
                    openPolicyModal("privacy");
                });
                return;
            }

            if (lowerLabel.includes("terms and conditions")) {
                link.addEventListener("click", (event) => {
                    event.preventDefault();
                    openPolicyModal("terms");
                });
                return;
            }

            if (link.closest(".notice_board_table") || link.closest(".exams_notice_table")) {
                link.addEventListener("click", (event) => {
                    event.preventDefault();
                    openNoticeModal(label);
                });
                return;
            }

            link.addEventListener("click", (event) => {
                event.preventDefault();
                showToast(`${label} will be available soon.`);
            });
        });
    };

    const updateTopNavActiveState = () => {
        const currentHash = window.location.hash.toLowerCase();

        document.querySelectorAll(".topnav a[href]").forEach((link) => {
            link.classList.remove("active-page");

            const href = (link.getAttribute("href") || "").trim();
            if (!href || href.startsWith("#") || href.startsWith("http")) {
                return;
            }

            const [rawFile, rawHash] = href.split("#");
            const linkFile = (rawFile || currentFile).toLowerCase();
            const linkHash = rawHash ? `#${rawHash.toLowerCase()}` : "";

            if (linkFile !== currentFile) {
                return;
            }

            if (linkHash) {
                if (linkHash === currentHash) {
                    link.classList.add("active-page");
                }
                return;
            }

            if (!currentHash) {
                link.classList.add("active-page");
            }
        });
    };

    const setupSmoothScroll = () => {
        document.querySelectorAll("a[href^='#']").forEach((link) => {
            const href = link.getAttribute("href") || "";
            if (href.length <= 1) {
                return;
            }

            link.addEventListener("click", (event) => {
                const targetId = href.slice(1);
                const target = document.getElementById(targetId);

                if (!target) {
                    return;
                }

                event.preventDefault();
                target.scrollIntoView({
                    behavior: prefersReducedMotion ? "auto" : "smooth",
                    block: "start",
                });

                if (window.location.hash !== href) {
                    history.pushState(null, "", href);
                    updateTopNavActiveState();
                }

                if (window.matchMedia(`(max-width: ${MOBILE_WIDTH}px)`).matches) {
                    closeNav();
                }
            });
        });
    };

    const setupSectionTracking = () => {
        const sectionLinks = Array.from(document.querySelectorAll("a[href^='#']")).filter((link) => {
            const href = link.getAttribute("href") || "";
            if (href.length <= 1) {
                return false;
            }

            const id = href.slice(1);
            return Boolean(document.getElementById(id));
        });

        if (!sectionLinks.length) {
            return;
        }

        const sections = Array.from(
            new Set(
                sectionLinks
                    .map((link) => (link.getAttribute("href") || "").slice(1))
                    .filter(Boolean)
            )
        )
            .map((id) => document.getElementById(id))
            .filter((node) => node instanceof HTMLElement);

        const setActiveSection = (id) => {
            sectionLinks.forEach((link) => {
                const href = (link.getAttribute("href") || "").slice(1);
                link.classList.toggle("active-section", href === id);
            });
        };

        const detectActiveSection = () => {
            const marker = window.innerHeight * 0.28;
            let activeId = "";

            sections.forEach((section) => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= marker && rect.bottom >= marker && !activeId) {
                    activeId = section.id;
                }
            });

            if (!activeId && window.location.hash) {
                activeId = window.location.hash.slice(1);
            }

            setActiveSection(activeId);
        };

        let isQueued = false;
        window.addEventListener(
            "scroll",
            () => {
                if (isQueued) {
                    return;
                }

                isQueued = true;
                requestAnimationFrame(() => {
                    detectActiveSection();
                    isQueued = false;
                });
            },
            { passive: true }
        );

        window.addEventListener("hashchange", detectActiveSection);
        detectActiveSection();
    };

    const setupBackToTop = () => {
        const backToTop = document.createElement("button");
        backToTop.className = "back-to-top";
        backToTop.type = "button";
        backToTop.textContent = "Top";
        backToTop.setAttribute("aria-label", "Back to top");
        document.body.appendChild(backToTop);

        const toggleVisibility = () => {
            backToTop.classList.toggle("show", window.scrollY > 380);
        };

        backToTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? "auto" : "smooth",
            });
        });

        window.addEventListener("scroll", toggleVisibility, { passive: true });
        toggleVisibility();
    };

    const setupFeeEstimator = () => {
        const estimator = document.querySelector("[data-fee-estimator]");
        if (!(estimator instanceof HTMLFormElement)) {
            return;
        }

        const programField = estimator.querySelector("[data-fee-program]");
        const scholarshipField = estimator.querySelector("[data-fee-scholarship]");
        const scholarshipOutput = estimator.querySelector("[data-fee-scholarship-output]");
        const hostelField = estimator.querySelector("[data-fee-hostel]");
        const totalOutput = estimator.querySelector("[data-fee-total]");

        if (!(
            programField instanceof HTMLSelectElement &&
            scholarshipField instanceof HTMLInputElement &&
            scholarshipOutput instanceof HTMLElement &&
            hostelField instanceof HTMLInputElement &&
            totalOutput instanceof HTMLElement
        )) {
            return;
        }

        const annualFees = {
            BTECH: 145000,
            MTECH: 128000,
            MCA: 118000,
        };

        const feeFormatter = new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        });

        const recalculateFee = () => {
            const programKey = programField.value || "BTECH";
            const baseFee = annualFees[programKey] || annualFees.BTECH;
            const scholarship = Number.parseInt(scholarshipField.value, 10) || 0;
            const hostelCost = hostelField.checked ? 65000 : 0;

            scholarshipOutput.textContent = `${scholarship}%`;

            const discounted = Math.round(baseFee * (1 - scholarship / 100));
            const total = Math.max(0, discounted + hostelCost);
            totalOutput.textContent = feeFormatter.format(total);
        };

        programField.addEventListener("change", recalculateFee);
        scholarshipField.addEventListener("input", recalculateFee);
        hostelField.addEventListener("change", recalculateFee);

        recalculateFee();
    };

    const setupResourceCenter = () => {
        const searchInput = document.querySelector("[data-resource-search]");
        const countOutput = document.querySelector("[data-resource-count]");
        const cards = Array.from(document.querySelectorAll("[data-resource-item]"));

        const applyFilter = () => {
            if (!(searchInput instanceof HTMLInputElement) || !cards.length) {
                return;
            }

            const query = searchInput.value.trim().toLowerCase();
            let visibleCount = 0;

            cards.forEach((card) => {
                const text = (card.textContent || "").toLowerCase();
                const isVisible = !query || text.includes(query);
                card.classList.toggle("is-hidden", !isVisible);
                if (isVisible) {
                    visibleCount += 1;
                }
            });

            if (countOutput instanceof HTMLElement) {
                countOutput.textContent = String(visibleCount);
            }
        };

        if (searchInput instanceof HTMLInputElement) {
            searchInput.addEventListener("input", applyFilter);
            applyFilter();
        }

        document.querySelectorAll("[data-download-name][data-download-content]").forEach((button) => {
            if (!(button instanceof HTMLButtonElement)) {
                return;
            }

            button.addEventListener("click", () => {
                const fileName = button.getAttribute("data-download-name") || "resource.txt";
                const fileContent = button.getAttribute("data-download-content") || "";
                const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
                const blobUrl = URL.createObjectURL(blob);
                const downloadLink = document.createElement("a");

                downloadLink.href = blobUrl;
                downloadLink.download = fileName;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);

                URL.revokeObjectURL(blobUrl);
                showToast(`${fileName} downloaded.`);
            });
        });
    };

    if (nav && navToggle) {
        navToggle.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("open");
            navToggle.setAttribute("aria-expanded", String(isOpen));
            navToggle.textContent = isOpen ? "Close" : "Menu";

            if (!isOpen) {
                closeAllDropdowns();
            }
        });

        nav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                if (window.matchMedia(`(max-width: ${MOBILE_WIDTH}px)`).matches) {
                    closeNav();
                }
            });
        });

        window.addEventListener("resize", () => {
            if (!window.matchMedia(`(max-width: ${MOBILE_WIDTH}px)`).matches) {
                closeNav();
            }
        });
    }

    document.querySelectorAll("[data-dropdown-toggle]").forEach((button) => {
        button.addEventListener("click", () => {
            if (!window.matchMedia(`(max-width: ${MOBILE_WIDTH}px)`).matches) {
                return;
            }

            const parent = button.closest(".dropdown");
            if (!parent) {
                return;
            }

            const willOpen = !parent.classList.contains("open");
            closeAllDropdowns();

            if (willOpen) {
                parent.classList.add("open");
            }

            button.setAttribute("aria-expanded", String(willOpen));
        });
    });

    document.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
            return;
        }

        if (!target.closest(".dropdown")) {
            closeAllDropdowns();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeAllDropdowns();
            closeNav();
            closeModal();
        }
    });

    document.querySelectorAll(".student-login").forEach((button) => {
        button.addEventListener("click", () => {
            openLoginModal("Student");
        });
    });

    document.querySelectorAll(".staff-login").forEach((button) => {
        button.addEventListener("click", () => {
            openLoginModal("Staff");
        });
    });

    enhancePlaceholderLinks();
    setupFeeEstimator();
    setupResourceCenter();
    setupSmoothScroll();
    setupSectionTracking();
    setupBackToTop();
    updateTopNavActiveState();

    window.addEventListener("hashchange", updateTopNavActiveState);

    document.querySelectorAll(".current-year").forEach((yearSlot) => {
        yearSlot.textContent = String(new Date().getFullYear());
    });
});

function createToast() {
    const toast = document.createElement("div");
    toast.className = "site-toast";
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
    return toast;
}

function createModalShell() {
    const modal = document.createElement("div");
    modal.className = "site-modal";
    modal.innerHTML = `
        <div class="site-modal-card" role="dialog" aria-modal="true" aria-labelledby="site-modal-title">
            <button class="site-modal-close" type="button" aria-label="Close dialog">Close</button>
            <h3 id="site-modal-title"></h3>
            <p class="site-modal-subtitle"></p>
            <div class="site-modal-body"></div>
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
}
