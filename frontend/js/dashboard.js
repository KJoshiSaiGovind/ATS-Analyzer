document.addEventListener('DOMContentLoaded', async () => {
    if (!api.getToken()) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('logout-btn').addEventListener('click', () => {
        api.logout();
        window.location.href = 'index.html';
    });

    const statusBadge = document.getElementById('resume-status');
    const uploadForm = document.getElementById('upload-form');
    const analyzeForm = document.getElementById('analyze-form');
    const resultsPanel = document.getElementById('results-panel');

    async function loadDashboard() {
        try {
            const data = await api.request('/dashboard', 'GET');
            
            if (data.resume_status === 'Uploaded') {
                statusBadge.textContent = 'Uploaded: ' + data.resume_name;
                statusBadge.className = 'badge badge-success';
                analyzeForm.querySelector('button').disabled = false;
                
                const detectedDiv = document.getElementById('detected-skills');
                detectedDiv.innerHTML = '';
                data.detected_skills.forEach(skill => {
                    const span = document.createElement('span');
                    span.className = 'badge badge-info';
                    span.textContent = skill;
                    detectedDiv.appendChild(span);
                });

                const rolesDiv = document.getElementById('recommended-roles');
                rolesDiv.innerHTML = '';
                if (data.recommended_roles && data.recommended_roles.length > 0) {
                    data.recommended_roles.forEach(role => {
                        const span = document.createElement('span');
                        span.className = 'badge';
                        span.style.background = 'rgba(139, 92, 246, 0.2)';
                        span.style.color = '#c4b5fd';
                        span.style.border = '1px solid rgba(139, 92, 246, 0.3)';
                        span.textContent = '★ ' + role;
                        rolesDiv.appendChild(span);
                    });
                } else {
                    rolesDiv.innerHTML = '<span style="font-size: 0.8rem; color: #cbd5e1;">Upload a detailed resume for recommendations.</span>';
                }
            } else {
                statusBadge.textContent = 'Not Uploaded';
                statusBadge.className = 'badge badge-error';
                analyzeForm.querySelector('button').disabled = true;
            }

            if (data.last_ats_score !== null) {
                displayResults({
                    ats_score: data.last_ats_score,
                    matched_skills: data.last_matched_skills,
                    missing_skills: data.last_missing_skills,
                    suggestions: data.last_suggestions
                });
            }
        } catch (err) {
            console.error('Failed to load dashboard:', err);
        }
    }

    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fileInput = document.getElementById('resume-file');
        if (!fileInput.files[0]) return;

        const formData = new FormData();
        formData.append('file', fileInput.files[0]);

        const uploadBtn = uploadForm.querySelector('button');
        uploadBtn.textContent = 'Uploading...';
        uploadBtn.disabled = true;

        try {
            await api.request('/resumes', 'POST', formData, true);
            await loadDashboard();
            fileInput.value = '';
            alert('Resume uploaded successfully!');
        } catch (err) {
            alert('Upload failed: ' + err.message);
        } finally {
            uploadBtn.textContent = 'Upload Resume';
            uploadBtn.disabled = false;
        }
    });

    analyzeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const desc = document.getElementById('job-desc').value;
        if (!desc.trim()) return;

        const analyzeBtn = analyzeForm.querySelector('button');
        analyzeBtn.textContent = 'Analyzing...';
        analyzeBtn.disabled = true;

        try {
            const data = await api.request('/ats/analyze', 'POST', { job_description: desc });
            displayResults(data);
        } catch (err) {
            alert('Analysis failed: ' + err.message);
        } finally {
            analyzeBtn.textContent = 'Analyze Match';
            analyzeBtn.disabled = false;
        }
    });

    function displayResults(data) {
        resultsPanel.classList.remove('hidden');
        
        const scoreCircle = document.getElementById('score-circle');
        const scoreInner = document.getElementById('score-inner');
        scoreCircle.style.setProperty('--score', `${data.ats_score}%`);
        scoreInner.textContent = `${Math.round(data.ats_score)}%`;

        populateList('matched-skills', data.matched_skills, 'badge-success', '✓ ');
        populateList('missing-skills', data.missing_skills, 'badge-error', '✗ ');
        
        const suggestionsDiv = document.getElementById('suggestions-list');
        suggestionsDiv.innerHTML = '';
        data.suggestions.forEach(sug => {
            const li = document.createElement('li');
            li.textContent = sug;
            suggestionsDiv.appendChild(li);
        });
    }

    function populateList(elementId, items, badgeClass, prefix) {
        const div = document.getElementById(elementId);
        div.innerHTML = '';
        items.forEach(item => {
            const span = document.createElement('span');
            span.className = `badge ${badgeClass}`;
            span.textContent = prefix + item;
            div.appendChild(span);
        });
    }

    loadDashboard();
});
