document.addEventListener('DOMContentLoaded', () => {
    try {
    // Navigation
    const navOutline = document.getElementById('nav-outline');
    const navSlides = document.getElementById('nav-slides');
    const viewOutline = document.getElementById('outline-view');
    const viewSlides = document.getElementById('slides-view');

    navOutline.addEventListener('click', () => {
        navOutline.classList.add('active');
        navSlides.classList.remove('active');
        viewOutline.classList.add('active');
        viewSlides.classList.remove('active');
    });

    navSlides.addEventListener('click', () => {
        navSlides.classList.add('active');
        navOutline.classList.remove('active');
        viewSlides.classList.add('active');
        viewOutline.classList.remove('active');
    });

    // Outline Generator Logic
    const btnGenerateOutline = document.getElementById('generate-outline-btn');
    const outlineResult = document.getElementById('outline-result');
    const topicInput = document.getElementById('topic-input');

    btnGenerateOutline.addEventListener('click', () => {
        const topic = topicInput.value.trim() || 'AI 도구 활용';
        
        const mockOutline = `
            <h3>'${topic}' 연수 개요 제안</h3>
            <ol style="margin-left: 20px; margin-top: 10px; line-height: 1.8;">
                <li><strong>도입:</strong> 왜 지금 AI인가? (환각 박살내기)</li>
                <li><strong>전개 1:</strong> 멀티 에이전트와 ReAct 원리 이해</li>
                <li><strong>전개 2:</strong> 교육 현장 적용 사례 (수업, 행정)</li>
                <li><strong>실습:</strong> 나만의 프롬프트 만들기 (제미나이, 노트북LM)</li>
                <li><strong>마무리:</strong> AI와 함께하는 교사의 미래</li>
            </ol>
            <p style="margin-top: 20px; color: var(--text-muted); font-size: 0.9em;">
                *이 개요를 바탕으로 '슬라이드 생성기' 탭에서 내용이 꽉 찬 슬라이드를 만들어 보세요!
            </p>
        `;
        outlineResult.innerHTML = mockOutline;
        outlineResult.classList.remove('hidden');
        outlineResult.style.padding = '1.5rem';
        outlineResult.style.marginTop = '1.5rem';
        outlineResult.style.background = 'var(--bg-dark)';
        outlineResult.style.border = '1px solid var(--border-color)';
        outlineResult.style.borderRadius = '4px';
    });

    // Slide Generator Logic
    let slidesData = [
        {
            subtitle: "왜 '팀(Multi)'을 꾸려야 할까?",
            title: "환각(Hallucination)\\n박살내기",
            description: "혼자 다 하면 헛소리를 합니다.\\n역할을 <span class='text-blue'>잘게 쪼개고 검수</span>해야 절대 실수하지 않습니다.",
            hasBox: false
        },
        {
            subtitle: "에이전트의 '자율성' 원리",
            title: "무한 루프의\\n쳇바퀴 (ReAct)",
            description: "이 과정을 목표 달성 시까지 AI가 <span class='text-red'>무한 반복</span>시킵니다.",
            hasBox: false
        }
    ];
    let currentSlideIndex = 0;

    const slideInputsContainer = document.getElementById('slide-inputs');
    const slidePreview = document.getElementById('slide-preview');
    const addSlideBtn = document.getElementById('add-slide-btn');
    const prevBtn = document.getElementById('prev-slide-btn');
    const nextBtn = document.getElementById('next-slide-btn');
    const slideCounter = document.getElementById('slide-counter');

    function renderSlideForm() {
        slideInputsContainer.innerHTML = '';
        slidesData.forEach((slide, index) => {
            const div = document.createElement('div');
            div.className = 'slide-item';
            div.innerHTML = `
                <div style="display:flex; justify-content:space-between; margin-bottom: 10px;">
                    <strong>슬라이드 ${index + 1}</strong>
                    <button class="del-btn" data-index="${index}" style="padding: 2px 8px; background:var(--accent-red); font-size:12px;">삭제</button>
                </div>
                <div class="form-group">
                    <input type="text" class="input-subtitle" data-index="${index}" value="${slide.subtitle}" placeholder="작은 제목 (선택)">
                </div>
                <div class="form-group">
                    <textarea class="input-title" data-index="${index}" placeholder="큰 제목 (줄바꿈은 \\n 입력)">${slide.title}</textarea>
                </div>
                <div class="form-group">
                    <textarea class="input-desc" data-index="${index}" placeholder="하단 설명 (HTML 태그로 색상 강조 가능, 줄바꿈 \\n)">${slide.description}</textarea>
                </div>
                <label style="font-size: 14px; display: flex; align-items: center; gap: 5px;">
                    <input type="checkbox" class="input-box" data-index="${index}" ${slide.hasBox ? 'checked' : ''}>
                    제목에 테두리 박스 적용
                </label>
            `;
            slideInputsContainer.appendChild(div);
        });

        // Event listeners
        document.querySelectorAll('.input-subtitle').forEach(input => {
            input.addEventListener('input', (e) => {
                slidesData[e.target.dataset.index].subtitle = e.target.value;
                if(currentSlideIndex == e.target.dataset.index) renderPreview();
            });
        });
        document.querySelectorAll('.input-title').forEach(input => {
            input.addEventListener('input', (e) => {
                slidesData[e.target.dataset.index].title = e.target.value;
                if(currentSlideIndex == e.target.dataset.index) renderPreview();
            });
        });
        document.querySelectorAll('.input-desc').forEach(input => {
            input.addEventListener('input', (e) => {
                slidesData[e.target.dataset.index].description = e.target.value;
                if(currentSlideIndex == e.target.dataset.index) renderPreview();
            });
        });
        document.querySelectorAll('.input-box').forEach(input => {
            input.addEventListener('change', (e) => {
                slidesData[e.target.dataset.index].hasBox = e.target.checked;
                if(currentSlideIndex == e.target.dataset.index) renderPreview();
            });
        });
        document.querySelectorAll('.del-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                slidesData.splice(e.target.dataset.index, 1);
                if(currentSlideIndex >= slidesData.length) currentSlideIndex = Math.max(0, slidesData.length - 1);
                renderSlideForm();
                renderPreview();
            });
        });
    }

    function renderPreview() {
        if(slidesData.length === 0) {
            slidePreview.innerHTML = '<p style="color:var(--text-muted)">슬라이드를 추가해주세요.</p>';
            slideCounter.textContent = '0 / 0';
            return;
        }
        
        const slide = slidesData[currentSlideIndex];
        let titleHtml = slide.title.replace(/\\\\n/g, '<br>').replace(/\\n/g, '<br>');
        if(slide.hasBox) {
            titleHtml = \`<div class="highlight-box">\${titleHtml}</div>\`;
        }
        
        let descHtml = slide.description.replace(/\\\\n/g, '<br>').replace(/\\n/g, '<br>');

        slidePreview.innerHTML = \`
            <div class="slide-content" style="animation: fadeIn 0.5s ease;">
                \${slide.subtitle ? \`<h2>\${slide.subtitle}</h2>\` : ''}
                <h1>\${titleHtml}</h1>
                \${slide.description ? \`<p>\${descHtml}</p>\` : ''}
            </div>
        \`;
        slideCounter.textContent = \`\${currentSlideIndex + 1} / \${slidesData.length}\`;
    }

    addSlideBtn.addEventListener('click', () => {
        slidesData.push({subtitle: '', title: '새 슬라이드', description: '', hasBox: false});
        currentSlideIndex = slidesData.length - 1;
        renderSlideForm();
        renderPreview();
        // scroll to bottom of sidebar
        const sidebar = document.querySelector('.sidebar');
        sidebar.scrollTop = sidebar.scrollHeight;
    });

    prevBtn.addEventListener('click', () => {
        if(currentSlideIndex > 0) {
            currentSlideIndex--;
            renderPreview();
        }
    });

    nextBtn.addEventListener('click', () => {
        if(currentSlideIndex < slidesData.length - 1) {
            currentSlideIndex++;
            renderPreview();
        }
    });

    // Initialize
    renderSlideForm();
    renderPreview();
    
    } catch(e) {
        alert("스크립트 오류가 발생했습니다: " + e.message + "\\n" + e.stack);
    }
});
