// 全局变量
let currentSection = 0;
const sections = ['consumer-persona', 'customer-scenario', 'customer-love', 'customer-unmet-needs', 'purchase-intent', 'star-rating', 'opportunities'];
let personaChart = null;
let usageMomentsChart = null;
let usageLocationsChart = null;
let usageBehaviorsChart = null;
let ratingChart = null;

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeCharts();
    initializeTableInteractions();
    initializeModal();
    initializeTooltips();
    initializeScrollSpy();
    initializeExpandToggle();
});

// 导航功能初始化
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    navItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // 更新导航状态
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // 更新进度条
            const progress = ((index + 1) / sections.length) * 100;
            progressFill.style.width = progress + '%';
            progressText.textContent = `${index + 1}/${sections.length}`;
            
            // 滚动到对应区域
            const targetSection = document.getElementById(item.dataset.section);
            if (targetSection) {
                targetSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            currentSection = index;
        });
    });
}

// 图表初始化
function initializeCharts() {
    initializePersonaChart();
    initializeUsageMomentsChart();
    initializeUsageLocationsChart();
    initializeUsageBehaviorsChart();
    initializeRatingChart();
}

// 消费者画像饼图
function initializePersonaChart() {
    const ctx = document.getElementById('personaChart');
    if (!ctx || !window.reportData?.consumer_persona?.segments) return;
    
    const segments = window.reportData.consumer_persona.segments;
    
    personaChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: segments.map(s => s.name),
            datasets: [{
                data: segments.map(s => s.percentage),
                backgroundColor: segments.map(s => s.color),
                borderWidth: 3,
                borderColor: '#fff',
                hoverBorderWidth: 5,
                hoverBorderColor: '#FF9900'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: { size: 10 },
                        generateLabels: function(chart) {
                            const data = chart.data;
                            return data.labels.map((label, i) => ({
                                text: `${label} (${data.datasets[0].data[i]}%)`,
                                fillStyle: data.datasets[0].backgroundColor[i],
                                strokeStyle: data.datasets[0].backgroundColor[i],
                                lineWidth: 0,
                                hidden: false,
                                index: i
                            }));
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const segment = segments[context.dataIndex];
                            return [
                                `${segment.name}: ${segment.percentage}%`,
                                '',
                                ...segment.details,
                                '',
                                '典型评价:',
                                ...segment.quotes.map(q => `"${q}"`)
                            ];
                        }
                    },
                    backgroundColor: '#232F3E',
                    titleColor: '#FF9900',
                    bodyColor: '#fff',
                    borderColor: '#FF9900',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false,
                    bodyFont: { size: 11 },
                    titleFont: { size: 12, weight: 'bold' }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1500,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// 使用时刻图表
function initializeUsageMomentsChart() {
    const ctx = document.getElementById('usageMomentsChart');
    if (!ctx || !window.reportData?.consumer_persona?.usage_moments) return;
    
    const moments = window.reportData.consumer_persona.usage_moments;
    
    usageMomentsChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: moments.map(m => m.name),
            datasets: [{
                data: moments.map(m => m.percentage),
                backgroundColor: moments.map(m => m.color),
                borderWidth: 3,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: { size: 10 },
                        generateLabels: function(chart) {
                            const data = chart.data;
                            return data.labels.map((label, i) => ({
                                text: `${label} (${data.datasets[0].data[i]}%)`,
                                fillStyle: data.datasets[0].backgroundColor[i],
                                strokeStyle: data.datasets[0].backgroundColor[i],
                                lineWidth: 0,
                                hidden: false,
                                index: i
                            }));
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const moment = moments[context.dataIndex];
                            return [
                                `${moment.name}: ${moment.percentage}%`,
                                '',
                                ...moment.details
                            ];
                        }
                    },
                    backgroundColor: '#232F3E',
                    titleColor: '#FF9900',
                    bodyColor: '#fff',
                    borderColor: '#FF9900',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false,
                    bodyFont: { size: 11 },
                    titleFont: { size: 12, weight: 'bold' }
                }
            },
            animation: { duration: 1500, easing: 'easeInOutQuart' }
        }
    });
}

// 使用地点图表 - 改为饼图
function initializeUsageLocationsChart() {
    const ctx = document.getElementById('usageLocationsChart');
    if (!ctx || !window.reportData?.consumer_persona?.usage_locations) return;
    
    const locations = window.reportData.consumer_persona.usage_locations;
    
    usageLocationsChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: locations.map(l => l.name),
            datasets: [{
                data: locations.map(l => l.percentage),
                backgroundColor: locations.map(l => l.color),
                borderWidth: 3,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: { size: 10 },
                        generateLabels: function(chart) {
                            const data = chart.data;
                            return data.labels.map((label, i) => ({
                                text: `${label} (${data.datasets[0].data[i]}%)`,
                                fillStyle: data.datasets[0].backgroundColor[i],
                                strokeStyle: data.datasets[0].backgroundColor[i],
                                lineWidth: 0,
                                hidden: false,
                                index: i
                            }));
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const location = locations[context.dataIndex];
                            return [
                                `${location.name}: ${location.percentage}%`,
                                '',
                                ...location.details
                            ];
                        }
                    },
                    backgroundColor: '#232F3E',
                    titleColor: '#FF9900',
                    bodyColor: '#fff',
                    borderColor: '#FF9900',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false,
                    bodyFont: { size: 11 },
                    titleFont: { size: 12, weight: 'bold' }
                }
            },
            animation: { duration: 1500, easing: 'easeInOutQuart' }
        }
    });
}

// 使用行为图表
function initializeUsageBehaviorsChart() {
    const ctx = document.getElementById('usageBehaviorsChart');
    if (!ctx || !window.reportData?.consumer_persona?.usage_behaviors) return;
    
    const behaviors = window.reportData.consumer_persona.usage_behaviors;
    
    usageBehaviorsChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: behaviors.map(b => b.name),
            datasets: [{
                data: behaviors.map(b => b.percentage),
                backgroundColor: behaviors.map(b => b.color),
                borderWidth: 3,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: { size: 10 },
                        generateLabels: function(chart) {
                            const data = chart.data;
                            return data.labels.map((label, i) => ({
                                text: `${label} (${data.datasets[0].data[i]}%)`,
                                fillStyle: data.datasets[0].backgroundColor[i],
                                strokeStyle: data.datasets[0].backgroundColor[i],
                                lineWidth: 0,
                                hidden: false,
                                index: i
                            }));
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const behavior = behaviors[context.dataIndex];
                            return [
                                `${behavior.name}: ${behavior.percentage}%`,
                                '',
                                ...behavior.details
                            ];
                        }
                    },
                    backgroundColor: '#232F3E',
                    titleColor: '#FF9900',
                    bodyColor: '#fff',
                    borderColor: '#FF9900',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false,
                    bodyFont: { size: 11 },
                    titleFont: { size: 12, weight: 'bold' }
                }
            },
            animation: { duration: 1500, easing: 'easeInOutQuart' }
        }
    });
}

// 评分分布散点图
function initializeRatingChart() {
    const ctx = document.getElementById('ratingScatterChart');
    if (!ctx || !window.reportData?.star_rating?.issue_correlation) return;
    
    const correlationData = window.reportData.star_rating.issue_correlation;
    
    // 准备散点图数据
    const scatterData = correlationData.map(item => ({
        x: item.rating,
        y: item.count,
        label: item.issue,
        percentage: item.percentage,
        type: item.type,
        color: item.color
    }));
    
    ratingChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: '问题分布',
                data: scatterData,
                backgroundColor: function(context) {
                    return context.raw.color;
                },
                borderColor: function(context) {
                    const color = context.raw.color;
                    // 使边框颜色稍深一些
                    if (color === '#28a745') return '#1e7e34';
                    if (color === '#dc3545') return '#bd2130';
                    if (color === '#ffc107') return '#e0a800';
                    return color;
                },
                borderWidth: 2,
                pointRadius: function(context) {
                    return Math.max(6, context.parsed.y / 3);
                },
                pointHoverRadius: function(context) {
                    return Math.max(10, context.parsed.y / 2);
                }
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    min: 0.5,
                    max: 5.5,
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            return value + '星';
                        }
                    },
                    title: {
                        display: true,
                        text: '评分等级',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: '#e0e0e0'
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 20,
                    title: {
                        display: true,
                        text: '出现频次',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: '#e0e0e0'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            const point = context[0];
                            return point.raw.label;
                        },
                        label: function(context) {
                            const point = context.raw;
                            const typeText = point.type === 'positive' ? '(正面评价)' : 
                                           point.type === 'negative' ? '(负面评价)' : '(中性评价)';
                            return [
                                `评分: ${point.x}星`,
                                `出现频次: ${point.y}条`,
                                `占比: ${point.percentage}%`,
                                typeText
                            ];
                        }
                    },
                    backgroundColor: '#232F3E',
                    titleColor: '#FF9900',
                    bodyColor: '#fff',
                    borderColor: '#FF9900',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            },
            onHover: (event, activeElements) => {
                event.native.target.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
            }
        }
    });
}

// 表格交互初始化
function initializeTableInteractions() {
    const tableRows = document.querySelectorAll('.table-row');
    
    tableRows.forEach(row => {
        row.addEventListener('click', () => {
            const comments = JSON.parse(row.dataset.comments || '[]');
            const title = row.querySelector('.name').textContent;
            showCommentsModal(title, comments);
        });
        
        // 添加悬停效果
        row.addEventListener('mouseenter', () => {
            const bar = row.querySelector('.bar');
            if (bar) {
                bar.style.transform = 'scaleX(1.05)';
                bar.style.boxShadow = '0 4px 12px rgba(255, 153, 0, 0.3)';
            }
        });
        
        row.addEventListener('mouseleave', () => {
            const bar = row.querySelector('.bar');
            if (bar) {
                bar.style.transform = 'scaleX(1)';
                bar.style.boxShadow = 'none';
            }
        });
    });
}

// 模态框初始化
function initializeModal() {
    const modal = document.getElementById('commentsModal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // ESC键关闭模态框
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
}

// 显示评论模态框
function showCommentsModal(title, comments) {
    const modal = document.getElementById('commentsModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = `${title} - 用户评论`;
    
    modalBody.innerHTML = comments.map(comment => 
        `<div class="comment-item">"${comment}"</div>`
    ).join('');
    
    modal.style.display = 'block';
    
    // 添加显示动画
    setTimeout(() => {
        modal.querySelector('.modal-content').style.transform = 'scale(1)';
        modal.querySelector('.modal-content').style.opacity = '1';
    }, 10);
}

// 工具提示初始化 - 移除洞察卡片的tooltip
function initializeTooltips() {
    // 移除了洞察卡片的tooltip功能，因为信息已经完全显示
    // 可以在这里添加其他需要tooltip的元素
}

// 显示工具提示
function showTooltip(event, content) {
    const tooltip = document.getElementById('tooltip');
    tooltip.textContent = content;
    tooltip.classList.add('show');
    updateTooltipPosition(event);
}

// 隐藏工具提示
function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.classList.remove('show');
}

// 更新工具提示位置
function updateTooltipPosition(event) {
    const tooltip = document.getElementById('tooltip');
    const rect = tooltip.getBoundingClientRect();
    
    let left = event.pageX - rect.width / 2;
    let top = event.pageY - rect.height - 10;
    
    // 边界检查
    if (left < 10) left = 10;
    if (left + rect.width > window.innerWidth - 10) {
        left = window.innerWidth - rect.width - 10;
    }
    if (top < 10) top = event.pageY + 10;
    
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
}

// 滚动监听初始化
function initializeScrollSpy() {
    const navItems = document.querySelectorAll('.nav-item');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                const sectionIndex = sections.indexOf(sectionId);
                
                if (sectionIndex !== -1) {
                    // 更新导航状态
                    navItems.forEach(nav => nav.classList.remove('active'));
                    navItems[sectionIndex].classList.add('active');
                    
                    // 更新进度条
                    const progress = ((sectionIndex + 1) / sections.length) * 100;
                    progressFill.style.width = progress + '%';
                    progressText.textContent = `${sectionIndex + 1}/${sections.length}`;
                    
                    currentSection = sectionIndex;
                }
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-100px 0px -50% 0px'
    });
    
    // 观察所有section
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            observer.observe(section);
        }
    });
}

// 折叠展开功能初始化
function initializeExpandToggle() {
    const toggles = document.querySelectorAll('.expand-toggle');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const target = toggle.dataset.target;
            const collapsibleRows = document.querySelectorAll(`.${target}-table .collapsible-row, .${target}-table .collapsible-row`);
            const isExpanded = toggle.classList.contains('expanded');
            
            if (isExpanded) {
                // 收起
                collapsibleRows.forEach((row, index) => {
                    setTimeout(() => {
                        row.classList.add('collapsing');
                        setTimeout(() => {
                            row.classList.add('hidden');
                            row.classList.remove('collapsing');
                        }, 300);
                    }, index * 50);
                });
                
                toggle.classList.remove('expanded');
                toggle.querySelector('.toggle-text').textContent = '显示全部10项';
            } else {
                // 展开
                collapsibleRows.forEach((row, index) => {
                    setTimeout(() => {
                        row.classList.remove('hidden');
                        row.classList.add('expanding');
                        setTimeout(() => {
                            row.classList.remove('expanding');
                        }, 300);
                    }, index * 50);
                });
                
                toggle.classList.add('expanded');
                toggle.querySelector('.toggle-text').textContent = '收起显示前5项';
            }
        });
    });
}

// 添加页面加载动画
window.addEventListener('load', () => {
    // 为所有section添加淡入动画
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            section.style.transition = 'all 0.6s ease';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // 为条形图添加动画
    setTimeout(() => {
        const bars = document.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            const originalWidth = bar.style.width;
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.transition = 'width 1s ease';
                bar.style.width = originalWidth;
            }, index * 100);
        });
    }, 1000);
});

// 键盘导航支持
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' && currentSection > 0) {
        const prevNavItem = document.querySelector(`[data-section="${sections[currentSection - 1]}"]`);
        if (prevNavItem) prevNavItem.click();
    } else if (event.key === 'ArrowRight' && currentSection < sections.length - 1) {
        const nextNavItem = document.querySelector(`[data-section="${sections[currentSection + 1]}"]`);
        if (nextNavItem) nextNavItem.click();
    }
});

// 添加返回顶部按钮
function addBackToTopButton() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.className = 'back-to-top';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--amazon-orange);
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(backToTop);
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.transform = 'scale(1)';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.transform = 'scale(0.8)';
        }
    });
}

// 初始化返回顶部按钮
document.addEventListener('DOMContentLoaded', addBackToTopButton);
