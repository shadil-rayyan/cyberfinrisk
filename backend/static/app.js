document.getElementById('scanForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // UI states
    const scanBtn = document.getElementById('scanBtn');
    const loadingState = document.getElementById('loadingState');
    const resultsPanel = document.getElementById('resultsPanel');
    
    scanBtn.classList.add('hidden');
    loadingState.classList.remove('hidden');
    resultsPanel.classList.add('hidden');
    
    // Smooth scroll to loading state on mobile
    if(window.innerWidth < 1024) {
        loadingState.scrollIntoView({behavior: "smooth"});
    }
    
    // Prepare payload
    const payload = {
        repo_url: document.getElementById('repoUrl').value,
        branch: document.getElementById('repoBranch').value || 'main',
        company: {
            company_name: document.getElementById('companyName').value,
            industry: document.getElementById('industry').value,
            annual_revenue: Number(document.getElementById('annualRevenue').value),
            active_users: Number(document.getElementById('activeUsers').value),
            arpu: Number(document.getElementById('arpu').value),
            engineer_hourly_cost: 80,
            infrastructure_type: "cloud",
            deployment_exposure: document.getElementById('exposure').value,
            sensitive_data_types: ["PII", "financial", "health"],
            regulatory_frameworks: ["GDPR", "PCI_DSS"],
            estimated_records_stored: Number(document.getElementById('recordsStored').value),
            company_size: document.getElementById('companySize').value
        }
    };

    try {
        const response = await fetch('/scan-repo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.detail || "Scan failed");
        }

        const results = await response.json();
        renderResults(results);
        
        // Scroll to results
        setTimeout(() => {
            resultsPanel.scrollIntoView({behavior: "smooth", block: "start"});
        }, 100);
        
    } catch (error) {
        alert("Error during scan:\n" + error.message);
    } finally {
        scanBtn.classList.remove('hidden');
        loadingState.classList.add('hidden');
    }
});

function renderResults(results) {
    const resultsPanel = document.getElementById('resultsPanel');
    const vulnList = document.getElementById('vulnList');
    
    let totalLoss = 0;
    let critHigh = 0;
    
    vulnList.innerHTML = '';
    
    if (results.length === 0) {
        vulnList.innerHTML = `
            <div style="text-align:center; padding: 40px; background: rgba(46, 160, 67, 0.1); border: 1px solid rgba(46, 160, 67, 0.3); border-radius: 14px;">
                <h3 style="color: #56d364; font-size: 1.5rem; margin-bottom: 10px;">Coast is Clear! ✨</h3>
                <p style="color: var(--text-muted);">No security vulnerabilities found.</p>
            </div>
        `;
    }

    results.forEach((res, i) => {
        totalLoss += res.expected_loss;
        if (res.severity === 'critical' || res.severity === 'high') {
            critHigh++;
        }

        const item = document.createElement('div');
        item.className = 'vuln-item';
        // subtle animation
        item.style.animation = `float 0.5s ease-out ${i * 0.1}s backwards`;
        
        item.innerHTML = `
            <div class="vuln-header">
                <div class="vuln-title">
                    <span class="badge ${res.severity}">${res.severity}</span>
                    ${res.bug_type.replace(/_/g, ' ')} 
                </div>
                <div class="loss-amount">Loss: $${res.expected_loss.toLocaleString(undefined, {maximumFractionDigits:0})}</div>
            </div>
            <div class="vuln-meta">
                <span>File: <strong>${res.file}:${res.line}</strong></span>
                <span>Exploit Likelihood: <strong>${(res.probability_of_exploit * 100).toFixed(1)}%</strong></span>
                <span>Fix Effort: <strong>${res.fix_effort_hours}h</strong></span>
            </div>
            <div class="expl">${escapeHtml(res.explanation)}</div>
        `;
        vulnList.appendChild(item);
    });

    // Update numbers with animation
    animateValue('totalLoss', totalLoss, true);
    animateValue('vulnCount', results.length, false);
    animateValue('criticalCount', critHigh, false);
    
    resultsPanel.classList.remove('hidden');
}

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

function animateValue(id, end, isCurrency) {
    const obj = document.getElementById(id);
    let startTimestamp = null;
    const duration = 1500;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // easeOutQuart
        const ease = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(ease * end);
        
        if(isCurrency) {
            obj.innerHTML = '$' + current.toLocaleString(undefined, {maximumFractionDigits:0});
        } else {
            obj.innerHTML = current;
        }
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            if(isCurrency) obj.innerHTML = '$' + end.toLocaleString(undefined, {maximumFractionDigits:0});
            else obj.innerHTML = end;
        }
    };
    window.requestAnimationFrame(step);
}
