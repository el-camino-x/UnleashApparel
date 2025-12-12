document.addEventListener('DOMContentLoaded', function() {

    const galleryGrid = document.getElementById('galleryGrid');
    const categoryButtons = document.querySelectorAll('.category-buttons button');

    const sheetCsvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRboqZEBiUEQHouonAd-xBZzI2H56JYmK0L4KapC6hThYXidsl2JIB_A9kTiFJHKlVl5fG43-LMz_Ge/pub?output=csv';

    let galleryData = [];

    // Untuk modal detail
    const modal = document.getElementById('galleryModal');
    const modalImg = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalPrice = document.getElementById('modalPrice');
    const prevBtn = document.getElementById('prevDetail');
    const nextBtn = document.getElementById('nextDetail');

    let currentDetails = [];
    let currentIndex = 0;

    fetch(sheetCsvUrl)
    .then(res => res.text())
    .then(csvText => {
        const lines = csvText.split('\n').filter(l => l.trim() !== '');
        lines.shift(); // buang header

        galleryData = lines.map(line => {
            const cols = line.split(',');
            return {
                kategori: cols[0]?.trim() || '',
                judul: cols[1]?.trim() || '',
                deskripsi: cols[2]?.trim() || '',
                url: cols[3]?.trim() || '',
                price: cols[4]?.trim() || '-',
                detail1: cols[5]?.trim() || '',
                detail2: cols[6]?.trim() || '',
                detail3: cols[7]?.trim() || '',
                detail4: cols[8]?.trim() || '',
                detail5: cols[9]?.trim() || ''
            };
        });

        renderGallery('all');
    })
    .catch(err => console.error('Fetch CSV error:', err));

    function renderGallery(filter) {
        const f = filter.trim().toLowerCase();
        galleryGrid.innerHTML = '';

        galleryData.forEach(item => {
            const itemCategory = item.kategori.trim().toLowerCase();
            if (f === 'all' || itemCategory === f) {
                const card = document.createElement('div');
                card.classList.add('gallery-card');
                card.innerHTML = `
                    <img src="${item.url}" alt="${item.judul}">
                    <h3>${item.judul}</h3>
                    <p>${item.deskripsi}</p>
                `;

                // Klik card → buka modal
                card.addEventListener('click', () => {
                    // Ambil semua detail yang ada
                    currentDetails = [
                        item.url,
                        item.detail1,
                        item.detail2,
                        item.detail3,
                        item.detail4,
                        item.detail5
                    ].filter(x => x && x.trim() !== '');

                    if(currentDetails.length === 0) return;

                    currentIndex = 0;
                    modal.style.display = 'block';
                    modalImg.src = currentDetails[currentIndex];
                    modalTitle.textContent = item.judul || '-';
                    modalDesc.textContent = item.deskripsi || '-';
                    modalPrice.textContent = item.price || '-';
                });

                galleryGrid.appendChild(card);
            }
        });
    }

    // Prev / Next tombol HANYA SEKALI
    prevBtn.addEventListener('click', () => {
        if(currentDetails.length === 0) return;
        currentIndex = (currentIndex - 1 + currentDetails.length) % currentDetails.length;
        modalImg.src = currentDetails[currentIndex];
    });

    nextBtn.addEventListener('click', () => {
        if(currentDetails.length === 0) return;
        currentIndex = (currentIndex + 1) % currentDetails.length;
        modalImg.src = currentDetails[currentIndex];
    });

    // Close modal
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.style.display = 'none');
        window.addEventListener('click', e => {
            if(e.target === modal) modal.style.display = 'none';
        });
    }

    // Category filter
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category').trim();
            renderGallery(category);
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Warning popup (right click / inspect)
    function showWarning(msg) {
        const popup = document.getElementById("warnPopup");
        if(!popup) return;
        popup.textContent = msg;
        popup.classList.add("show");
        setTimeout(() => popup.classList.remove("show"), 500);
    }

    document.addEventListener("contextmenu", e => {
        e.preventDefault();
        showWarning("Stop trying to get into my mind!");
    });

    document.onkeydown = function(e) {
        if (e.keyCode === 123 || 
            (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) ||
            (e.ctrlKey && e.keyCode === 85)) {
            showWarning("Stop trying to get into my mind!");
            return false;
        }
    };

    window.addEventListener('click', e => {
    if (e.target === modal) modal.style.display = 'none';
});

});
