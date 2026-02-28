// =======================================================
// 1. EFEK NAVBAR SAAT DI-SCROLL
// =======================================================
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';
            navbar.style.backgroundColor = 'rgba(10, 11, 16, 0.98)';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.backgroundColor = 'rgba(10, 11, 16, 0.95)';
        }
    }
});

// =======================================================
// 2. HIGHLIGHT MENU AKTIF SAAT SCROLL HALAMAN
// =======================================================
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= (sectionTop - 250)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (current && link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// =======================================================
// 3. MENU HAMBURGER UNTUK VERSI MOBILE (HP)
// =======================================================
const menuToggle = document.querySelector('.menu-toggle');
const navLinksContainer = document.querySelector('.nav-links');

if(menuToggle && navLinksContainer) {
    menuToggle.addEventListener('click', function() {
        navLinksContainer.classList.toggle('slide');
    });
}

// Tutup menu otomatis kalau salah satu link diklik (khusus di HP)
navLinks.forEach(item => {
    item.addEventListener('click', () => {
        if (window.innerWidth <= 768 && navLinksContainer) {
            navLinksContainer.classList.remove('slide');
        }
    });
});

// =======================================================
// 4. ANIMASI SLIDER TESTIMONI
// =======================================================
const dots = document.querySelectorAll('.dot');
const testimonialText = document.querySelector('.testimonial-box p');
const testimonialAuthor = document.querySelector('.testimonial-box h4');

const testimonials = [
    {
        text: '"San Fotografi benar-benar tahu cara menangkap emosi. Hasil foto pernikahan kami sangat indah dan autentik. Prosesnya santai dan hasilnya sangat cepat!"',
        author: '- Rina & Andi -'
    },
    {
        text: '"Hasil kerja tim San sangat memuaskan, foto produk kami terlihat mahal dan elegan. Sangat direkomendasikan untuk brand yang butuh visual profesional!"',
        author: '- CEO Alpha Brand -'
    },
    {
        text: '"Komunikasi lancar, pengerjaan tepat waktu, dan tangkapan momen event kami benar-benar di luar ekspektasi. Terima kasih tim San!"',
        author: '- Panitia Konser Indie -'
    }
];

if(dots.length > 0) {
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            dots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            
            if(testimonialText) testimonialText.style.opacity = '0';
            if(testimonialAuthor) testimonialAuthor.style.opacity = '0';
            
            setTimeout(() => {
                if(testimonialText) {
                    testimonialText.textContent = testimonials[index].text;
                    testimonialText.style.opacity = '1';
                }
                if(testimonialAuthor) {
                    testimonialAuthor.textContent = testimonials[index].author;
                    testimonialAuthor.style.opacity = '1';
                }
            }, 300);
        });
    });
}

// =======================================================
// 5. FILTER, PAGINATION (MAX 10) & LIGHTBOX (ZOOM FOTO)
// =======================================================
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioCards = Array.from(document.querySelectorAll('.portfolio-card')); 
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageInfo = document.getElementById('page-info');
const paginationControls = document.getElementById('pagination-controls');

// Settingan Halaman
let currentPage = 1;
const itemsPerPage = 10; // Batas maksimal foto yang tampil
let filteredCards = [...portfolioCards];

// Buat animasi FadeIn ringan via JS
const style = document.createElement('style');
style.innerHTML = `
    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Fungsi untuk menampilkan galeri sesuai halaman
function renderGallery() {
    if(portfolioCards.length === 0) return; // Hentikan fungsi jika tidak ada kartu galeri

    // Sembunyikan semua foto dulu
    portfolioCards.forEach(card => card.style.display = 'none');

    // Hitung index untuk memotong array foto
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Ambil foto yang masuk hitungan halaman ini
    const cardsToShow = filteredCards.slice(startIndex, endIndex);

    // Tampilkan fotonya
    cardsToShow.forEach(card => {
        card.style.display = 'block';
        card.style.opacity = '1';
        card.style.animation = 'fadeIn 0.5s ease';
    });

    // Urus Tombol Next/Back
    const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
    
    // Munculkan tombol jika total foto melebihi batas (10)
    if (totalPages > 1 && paginationControls) {
        paginationControls.style.display = 'flex';
        if(pageInfo) pageInfo.textContent = `Halaman ${currentPage} dari ${totalPages}`;
        if(prevBtn) prevBtn.disabled = currentPage === 1;
        if(nextBtn) nextBtn.disabled = currentPage === totalPages;
    } else if (paginationControls) {
        paginationControls.style.display = 'none';
    }
}

// Aksi Filter Kategori
if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Ubah warna tombol aktif
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.textContent.toLowerCase().trim();
            currentPage = 1; // Kembali ke halaman 1 setiap ganti filter

            // Saring array foto
            if (filterValue === 'semua') {
                filteredCards = [...portfolioCards];
            } else {
                filteredCards = portfolioCards.filter(card => {
                    const title = card.querySelector('h3');
                    return title && title.textContent.toLowerCase().includes(filterValue);
                });
            }
            renderGallery();
        });
    });
    // Panggil saat pertama web dibuka
    renderGallery();
}

// Aksi Tombol Next & Back
if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderGallery();
            // Scroll layar sedikit ke atas secara halus
            const portfolioSection = document.querySelector('.portfolio-section');
            if(portfolioSection) {
                window.scrollTo({ top: portfolioSection.offsetTop - 50, behavior: 'smooth' });
            }
        }
    });
}
if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderGallery();
            const portfolioSection = document.querySelector('.portfolio-section');
            if(portfolioSection) {
                window.scrollTo({ top: portfolioSection.offsetTop - 50, behavior: 'smooth' });
            }
        }
    });
}

// Fitur Lightbox (Klik Foto jadi Besar)
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeLightbox = document.querySelector('.close-lightbox');

if (lightbox && lightboxImg && closeLightbox) {
    // Tambah fungsi klik ke semua foto di dalam kartu
    document.querySelectorAll('.portfolio-card img').forEach(img => {
        img.addEventListener('click', () => {
            lightbox.style.display = 'block';
            lightboxImg.src = img.src; // Ambil resolusi foto yang diklik
        });
    });

    // Tutup Pop-up saat tombol silang diklik
    closeLightbox.addEventListener('click', () => {
        lightbox.style.display = 'none';
    });

    // Tutup Pop-up saat layar hitam di luar foto diklik
    lightbox.addEventListener('click', (e) => {
        if (e.target !== lightboxImg) {
            lightbox.style.display = 'none';
        }
    });
}