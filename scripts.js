document.addEventListener('DOMContentLoaded', function() {

    const galleryGrid = document.getElementById('galleryGrid');
    const categoryButtons = document.querySelectorAll('.category-buttons button');

    // Link CSV Google Sheet
    const sheetCsvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRboqZEBiUEQHouonAd-xBZzI2H56JYmK0L4KapC6hThYXidsl2JIB_A9kTiFJHKlVl5fG43-LMz_Ge/pub?output=csv';

    let galleryData = [];

    if(galleryGrid && categoryButtons.length > 0) {

        fetch(sheetCsvUrl)
        .then(res => res.text())
        .then(csvText => {
            // Parse CSV sederhana
            const lines = csvText.split('\n').filter(l => l.trim() !== '');
            const headers = lines.shift().split(','); // Kategori,Judul,Deskripsi,URL Foto,Pencipta,TanggalUpload

            galleryData = lines.map(line => {
                const cols = line.split(',');
                return {
                    kategori: cols[0]?.trim() || '',
                    judul: cols[1]?.trim() || '',
                    deskripsi: cols[2]?.trim() || '',
                    url: cols[3]?.trim() || '',
                    pencipta: cols[4]?.trim() || '-',
                    tanggalUpload: cols[5]?.trim() || '-'
                };
            });

            renderGallery('all'); // tampil awal semua
        })
        .catch(err => console.error('Fetch CSV error:', err));

        // Render gallery
        function renderGallery(filter) {
            const f = filter.trim().toLowerCase();
            galleryGrid.innerHTML = '';

            galleryData.forEach(item => {
                const itemCategory = item.kategori.trim().toLowerCase();
                if(f === 'all' || itemCategory === f) {
                    const card = document.createElement('div');
                    card.classList.add('gallery-card');
                    card.innerHTML = `
                        <img src="${item.url}" alt="${item.judul}">
                        <h3>${item.judul}</h3>
                        <p>${item.deskripsi}</p>
                    `;

                    // Tambahin modal click
                    const modal = document.getElementById('galleryModal');
                    const modalImg = document.getElementById('modalImage');
                    const modalTitle = document.getElementById('modalTitle');
                    const modalDesc = document.getElementById('modalDesc');
                    const modalCreator = document.getElementById('modalCreator');
                    const modalDate = document.getElementById('modalDate');

                    card.querySelector('img').addEventListener('click', () => {
                        modal.style.display = 'block';
                        modalImg.src = item.url;
                        modalTitle.textContent = item.judul || '-';
                        modalDesc.textContent = item.deskripsi || '-';
                        modalCreator.textContent = item.pencipta || '-';
                        modalDate.textContent = item.tanggalUpload || '-';
                    });

                    galleryGrid.appendChild(card);
                }
            });
        }

        // Tombol kategori filter
        categoryButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.getAttribute('data-category').trim();
                renderGallery(category);
                categoryButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    // Tutup modal
    const modal = document.getElementById('galleryModal');
    const closeBtn = document.querySelector('.close');
    if(closeBtn){
        closeBtn.addEventListener('click', () => modal.style.display = 'none');
        window.addEventListener('click', (e) => { 
            if(e.target === modal) modal.style.display = 'none'; 
        });
    }

    // ======= ANTI INSPECT =======

    // Tambahin popup warning
    function showWarning(msg) {
        const popup = document.getElementById("warnPopup");
        if(!popup) return;
        popup.textContent = msg;
        popup.classList.add("show");

        setTimeout(() => {
            popup.classList.remove("show");
        }, 500); // 0.5 detik
    }

    // Klik kanan
    document.addEventListener("contextmenu", function(e) {
        e.preventDefault();
        showWarning("Stop trying to get into my mind!");
    });

    // Keyboard
    document.onkeydown = function(e) {
        // F12
        if(e.keyCode === 123) { showWarning("Stop trying to get into my mind!"); return false; }
        // CTRL+SHIFT+I
        if(e.ctrlKey && e.shiftKey && e.keyCode === 73){ showWarning("Stop trying to get into my mind!"); return false; }
        // CTRL+SHIFT+J
        if(e.ctrlKey && e.shiftKey && e.keyCode === 74){ showWarning("Stop trying to get into my mind!"); return false; }
        // CTRL+U
        if(e.ctrlKey && e.keyCode === 85){ showWarning("Stop trying to get into my mind!"); return false; }
    };

});
