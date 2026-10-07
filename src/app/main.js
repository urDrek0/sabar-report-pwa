// alert("Aplikasi Masih dalam Pengembangan, untuk segala kendala silahkan dilaporkan, diperhatikan juga untuk aplikasi tidak sampai ke ke tangan lain")
function toggleSideBar() {
    const idToggled = [
        'aside-home',
        'today-date',
        'aside-calendar',
        'calendar-wrapper',
        'aside-shift',
        'aside-shift-text',
        'aside-pegawai',
        'aside-pasien',
        'prevMonth',
        'nextMonth',
    ];
    idToggled.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
            element.classList.toggle('hidden');
        }
    });
    document.getElementById('sidebar-container').classList.toggle('pr-4');
}
async function fetchDataPasien() {
    const resDaftarPasien = await fetch('http://localhost:3000/api/pasien');
    const data_pasien = await resDaftarPasien.json();
    return data_pasien;
}
async function fetchDataPegawai() {
    const resDaftarPasien = await fetch('http://localhost:3000/api/pegawai');
    const data_pegawai = await resDaftarPasien.json();
    return data_pegawai;
}
async function fetchDataSabr() {
    const resDaftarSabr = await fetch('http://localhost:3000/api/sabr_report');
    const data_sabr = await resDaftarSabr.json();
    return data_sabr;
}

async function dashboard() {
    document.getElementById('daftar-pegawai').classList.add('hidden');
    document.getElementById('table-data-daftar-pegawai').classList.add('hidden');
    document.getElementById('report-title-pegawai').classList.add('hidden');
    document.getElementById('table-header-pegawai').classList.add('hidden');

    document.getElementById('table-data-pasien-sabr').classList.remove('hidden');
    document.getElementById('report-title-dashboard').classList.remove('hidden');
    document.getElementById('table-header-dashboard').classList.remove('hidden');

    document.getElementById('daftar-pasien').classList.add('hidden');
    document.getElementById('report-title-pasien').classList.add('hidden');
    document.getElementById('table-header-pasien').classList.add('hidden');
    document.getElementById('table-data-daftar-pasien').classList.add('hidden');

    let data_sabr = await fetchDataSabr();
    let data_pasien = await fetchDataPasien();
    const nama_pasien = data_sabr.map((nama_pasien) => {
        const eachName = data_pasien.find((pasien) => pasien.id_pasien === nama_pasien.pasien_id);
        return eachName;
    });

    const shiftSelect = document.getElementById('aside-shift');
    const selectedShift = shiftSelect.value;
    shiftSelect.addEventListener('change', dashboard);

    const target = document.getElementById('table-data-pasien-sabr');
    if (selectedShift) {
        const filteredData = data_sabr.filter((sabr) => sabr.shift === selectedShift);
        const date = document.getElementById('auto-fill-date').value;
        const filteredDataByDate = filteredData.filter((sabr) => sabr.date === date);
        target.innerHTML = filteredData
        .map(
            (sabr) => `
                        <div id="data-sabr-wrapper" class="pt-1 pb-1">
                            <div id="" class="bg-white p-4 grid grid-cols-8 gap-4 w-full">
                                <h2 class="text-left">${sabr.tanggal_shift}</h2>
                                <h2 id="nama-pasien" class="text-left"></h2>
                                <h2 class="text-left">${sabr.shift}</h2>
                                <h2 class="text-justify">${sabr.situation}</h2>
                                <h2 class="text-justify">${sabr.background}</h2>
                                <h2 class="text-justify">${sabr.assessment}</h2>
                                <h2 class="text-justify">${sabr.recommendation}</h2>
                                <div id="action" class="flex space-x-4 justify-center place-self-start">
                                    <button class="max-w-5 h-auto cursor-pointer" id="" onclick="modalEditData()">
                                        <img src="src/asset/logo/edit.png" alt="" class="">
                                    </button>
                                    <button class="max-w-5 h-auto cursor-pointer" id="" onclick="modalDeleteData()">
                                        <img src="src/asset/logo/delete.png" alt="" class="">
                                    </button>
                                </div>
                            </div>
                        </div>    
                    `,
        )
        .join('');

        const namaPasienElements = document.querySelectorAll('#nama-pasien');
        namaPasienElements.forEach((element, index) => {
        element.textContent = nama_pasien[index].nama;
        });
    } else {
        const date = document.getElementById('auto-fill-date').value;
        console.log(`Shift yang dipilih : ${selectedShift} dan tanggal : ${date}`);
        target.innerHTML =
        '<h1 class="text-center text-gray-500">Tidak ada data pada shift ' +
        selectedShift +
        ' dan tanggal ' +
        date +
        '</h1>';
    }
}

dashboard();

async function daftarPegawai() {
    document.getElementById('table-data-pasien-sabr').classList.add('hidden');
    document.getElementById('report-title-dashboard').classList.add('hidden');
    document.getElementById('table-header-dashboard').classList.add('hidden');

    document.getElementById('daftar-pegawai').classList.remove('hidden');
    document.getElementById('table-data-daftar-pegawai').classList.remove('hidden');
    document.getElementById('report-title-pegawai').classList.remove('hidden');
    document.getElementById('table-header-pegawai').classList.remove('hidden');

    document.getElementById('daftar-pasien').classList.add('hidden');
    document.getElementById('report-title-pasien').classList.add('hidden');
    document.getElementById('table-header-pasien').classList.add('hidden');
    document.getElementById('table-data-daftar-pasien').classList.add('hidden');

    let data_pegawai = await fetchDataPegawai();
    const target = document.getElementById('table-data-daftar-pegawai');
    target.innerHTML = data_pegawai
        .map(
        (pegawai) => `
                        <div id="data-pegawai-wrapper" class="pt-1 pb-1">
                            <div id="" class="bg-white p-4 grid grid-cols-4 gap-4 w-full">
                                <h2 class="text-center">${pegawai.id_pegawai}</h2>
                                <h2 class="text-center">${pegawai.nama}</h2>
                                <h2 class="text-center">${pegawai.kode}</h2>
                                <div id="action" class="flex space-x-4 justify-center place-self-end">
                                    <button class="max-w-5 h-auto cursor-pointer" id="" onclick="modalEditData()">
                                        <img src="src/asset/logo/edit.png" alt="" class="">
                                    </button>
                                    <button class="max-w-5 h-auto cursor-pointer" id="" onclick="modalDeleteData()">
                                        <img src="src/asset/logo/delete.png" alt="" class="">
                                    </button>
                                </div>
                            </div>
                        </div>    
                `,
        )
        .join('');
}
async function daftarPasien() {
    document.getElementById('modal-add-data').classList.add('hidden');
    document.getElementById('daftar-pegawai').classList.add('hidden');
    document.getElementById('table-data-daftar-pegawai').classList.add('hidden');
    document.getElementById('report-title-pegawai').classList.add('hidden');
    document.getElementById('table-header-pegawai').classList.add('hidden');

    document.getElementById('table-data-pasien-sabr').classList.add('hidden');
    document.getElementById('report-title-dashboard').classList.add('hidden');
    document.getElementById('table-header-dashboard').classList.add('hidden');

    document.getElementById('daftar-pasien').classList.remove('hidden');
    document.getElementById('report-title-pasien').classList.remove('hidden');
    document.getElementById('table-header-pasien').classList.remove('hidden');
    document.getElementById('table-data-daftar-pasien').classList.remove('hidden');

    let data_pasien = await fetchDataPasien();
    const target = document.getElementById('table-data-daftar-pasien');
    target.innerHTML = data_pasien
        .map(
        (pasien) => `
                        <div id="data-pasien-wrapper" class="pt-1 pb-1">
                            <div id="" class="bg-white p-4 grid grid-cols-4 gap-4 w-full">
                                <h2 class="text-center">${pasien.id_pasien}</h2>
                                <h2 class="text-center">${pasien.nama}</h2>
                                <h2 class="text-center">${pasien.umur}</h2>
                                <div id="action" class="flex space-x-4 justify-center place-self-end">
                                    <button class="max-w-5 h-auto cursor-pointer" id="" onclick="modalEditData()">
                                        <img src="src/asset/logo/edit.png" alt="" class="">
                                    </button>
                                    <button class="max-w-5 h-auto cursor-pointer" id="" onclick="modalDeleteData()">
                                        <img src="src/asset/logo/delete.png" alt="" class="">
                                    </button>
                                </div>
                            </div>
                        </div>    
                `,
        )
        .join('');
}

let currentKeyword = '';

function searchName() {
    const searching = document.getElementById('searchForm');
    const inputText = document.getElementById('aside-search');

    function startSearching(text) {
        text.preventDefault();
        currentKeyword = inputText.value.trim();
        readKey(currentKeyword);
    }
    const returnValue = searching.addEventListener('submit', startSearching);
}
searchName();

async function readKey(keyword) {
    let data_sabr = await fetchDataSabr();
    let data_pasien = await fetchDataPasien();
    const nama_pasien = data_sabr.map((nama_pasien) => {
        const eachName = data_pasien.find((pasien) => pasien.id_pasien === nama_pasien.pasien_id);
        return eachName;
    });

    const shiftSelect = document.getElementById('aside-shift');
    const selectedShift = shiftSelect.value;
    shiftSelect.addEventListener('change', dashboard);

    const target = document.getElementById('table-data-pasien-sabr');
    console.log(`Filter yang apply : ${keyword}`);

    if (keyword === '') {
        await dashboard();
    } else if (keyword !== '') {
        if (selectedShift) {
        const filteredData = data_sabr.filter((sabr) => sabr.shift === selectedShift);
        const date = document.getElementById('auto-fill-date').value;
        const filteredDataByDate = filteredData.filter((sabr) => sabr.date === date);
        target.innerHTML = filteredData
            .map(
            (sabr) => `
                            <div id="data-sabr-wrapper" class="pt-1 pb-1">
                                <div id="" class="bg-white p-4 grid grid-cols-8 gap-4 w-full">
                                    <h2 class="text-center">${sabr.tanggal_shift}</h2>
                                    <h2 id="nama-pasien" class="text-center"></h2>
                                    <h2 class="text-left">${sabr.shift}</h2>
                                    <h2 class="text-justify">${sabr.situation}</h2>
                                    <h2 class="text-justify">${sabr.background}</h2>
                                    <h2 class="text-justify">${sabr.assessment}</h2>
                                    <h2 class="text-justify">${sabr.recommendation}</h2>
                                    <div id="action" class="flex space-x-4 justify-center place-self-start">
                                        <button class="max-w-5 h-auto cursor-pointer" id="" onclick="modalEditData()">
                                            <img src="src/asset/logo/edit.png" alt="" class="">
                                        </button>
                                        <button class="max-w-5 h-auto cursor-pointer" id="" onclick="modalDeleteData()">
                                            <img src="src/asset/logo/delete.png" alt="" class="">
                                        </button>
                                    </div>
                                </div>
                            </div>    
                        `,
            )
            .join('');

        const namaPasienElements = document.querySelectorAll('#nama-pasien');
        namaPasienElements.forEach((element, index) => {
            element.textContent = nama_pasien[index].nama;
        });
        } else {
        const date = document.getElementById('auto-fill-date').value;
        console.log(`Shift yang dipilih : ${selectedShift} dan tanggal : ${date}`);
        target.innerHTML =
            '<h1 class="text-center text-gray-500">Tidak ada data pada shift ' +
            selectedShift +
            ' dan tanggal ' +
            date +
            '</h1>';
        }
    }
}

async function addNewReport() {
    let data_pasien = await fetchDataPasien();
    document.getElementById('modal-add-data').classList.remove('hidden');
    const nameSelect = document.getElementById('pasien-name');
    nameSelect.innerHTML = data_pasien
        .map((pasien) => `<option value="${pasien.nama}">${pasien.nama}</option>`)
        .join('');
}

async function modalEditData() {
    let data_pasien = await fetchDataPasien();
    document.getElementById('modal-add-data').classList.remove('hidden');
    const nameSelect = document.getElementById('pasien-name');
    nameSelect.innerHTML = data_pasien
        .map((pasien) => `<option value="${pasien.nama}">${pasien.nama}</option>`)
        .join('');
}

async function modalDeleteData() {
    document.getElementById('modal-delete').classList.remove('hidden');
}

// calendar
let calendar;

document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('navbar-content-calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        height: 315,
        headerToolbar: {
        left: 'prev',
        center: 'title',
        right: 'next',
        },
        footerToolbar: {
        left: 'prevYear',
        center: 'today',
        right: 'nextYear',
        },
        titleFormat: {
        year: 'numeric',
        month: 'short',
        },
    });
    calendar.render();
    const dateNow = document.getElementById('today-date');
    const autoFillDate = document.getElementById('auto-fill-date');
    const dateFormatting = calendar.getDate();
    dateNow.textContent =
        'Today : ' +
        dateFormatting.toLocaleDateString('id-ID', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        });
    autoFillDate.value = dateFormatting.toLocaleDateString('id-ID', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
});
