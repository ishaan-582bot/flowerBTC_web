// Dock Navigation Functionality
class DockNavigation {
    constructor() {
        this.dockContainer = null;
        this.dockItems = [];
        this.isVisible = false;
        this.init();
    }

    init() {
        // Create dock container
        this.createDockContainer();
        
        // Wait for page load and show dock after delay
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.showDockAfterDelay();
            });
        } else {
            this.showDockAfterDelay();
        }
    }

    createDockContainer() {
        // Create dock container
        this.dockContainer = document.createElement('div');
        this.dockContainer.className = 'dock-container';
        
        // Create dock items
        const pages = [
            { id: 'home', icon: 'fas fa-home', label: 'Home', url: 'index.html' },
            { id: 'about', icon: 'fas fa-info-circle', label: 'About', url: 'about.html' },
            { id: 'contact', icon: 'fas fa-envelope', label: 'Contact', url: 'inquiry.html' },
            { id: 'faq', icon: 'fas fa-question-circle', label: 'FAQ', url: 'faq.html' }
        ];

        pages.forEach(page => {
            const dockItem = this.createDockItem(page);
            this.dockContainer.appendChild(dockItem);
            this.dockItems.push(dockItem);
        });

        // Insert dock at the beginning of body
        document.body.insertBefore(this.dockContainer, document.body.firstChild);

        // Set active item based on current page
        this.setActiveItem();

        // Add event listeners
        this.addEventListeners();
    }

    createDockItem(page) {
        const dockItem = document.createElement('div');
        dockItem.className = 'dock-item';
        dockItem.setAttribute('data-page', page.id);

        dockItem.innerHTML = `
            <i class="dock-icon ${page.icon}"></i>
            <span class="dock-label">${page.label}</span>
        `;

        // Add click event
        dockItem.addEventListener('click', () => {
            this.navigateToPage(page.url);
        });

        return dockItem;
    }

    setActiveItem() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const pageMap = {
            'index.html': 'home',
            'about.html': 'about',
            'inquiry.html': 'contact',
            'faq.html': 'faq'
        };

        const activePage = pageMap[currentPage] || 'home';
        
        this.dockItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-page') === activePage) {
                item.classList.add('active');
            }
        });
    }

    addEventListeners() {
        // Mouse tracking for magnification effect
        let mouseX = 0;
        let isHovering = false;

        this.dockContainer.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            isHovering = true;
            this.updateMagnification();
        });

        this.dockContainer.addEventListener('mouseleave', () => {
            isHovering = false;
            this.resetMagnification();
        });

        // Add hover effects
        this.dockItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            });

            item.addEventListener('mouseleave', () => {
                item.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            });
        });
    }

    updateMagnification() {
        if (!isHovering) return;

        this.dockItems.forEach((item) => {
            const rect = item.getBoundingClientRect();
            const itemCenterX = rect.left + rect.width / 2;
            const distance = Math.abs(mouseX - itemCenterX);
            const maxDistance = 150;
            
            if (distance < maxDistance) {
                const scale = 1 + (1 - distance / maxDistance) * 0.4;
                const translateY = -(1 - distance / maxDistance) * 15;
                item.style.transform = `scale(${scale}) translateY(${translateY}px)`;
                item.classList.add('magnified');
            } else {
                item.style.transform = 'scale(1) translateY(0)';
                item.classList.remove('magnified');
            }
        });
    }

    resetMagnification() {
        this.dockItems.forEach(item => {
            item.style.transform = 'scale(1) translateY(0)';
            item.classList.remove('magnified');
        });
    }

    navigateToPage(url) {
        // Remove active class from all items
        this.dockItems.forEach(dockItem => dockItem.classList.remove('active'));
        
        // Add active class to clicked item
        const clickedItem = event.currentTarget;
        clickedItem.classList.add('active');
        
        // Navigate to page
        window.location.href = url;
    }

    showDockAfterDelay() {
        // Show dock after 4.5 seconds
        setTimeout(() => {
            this.showDock();
        }, 4500);
    }

    showDock() {
        this.dockContainer.classList.add('visible');
        this.isVisible = true;
    }

    hideDock() {
        this.dockContainer.classList.remove('visible');
        this.dockContainer.classList.add('hidden');
        this.isVisible = false;
    }
}

// Initialize dock navigation when script loads
if (typeof window !== 'undefined') {
    window.dockNavigation = new DockNavigation();
} 