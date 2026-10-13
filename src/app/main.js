// alert("Aplikasi Masih dalam Pengembangan, untuk segala kendala silahkan dilaporkan, diperhatikan juga untuk aplikasi tidak sampai ke ke tangan lain")
let state = {
    currentPage: 'dashboard',
}
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
async function fetchDataShiftHandler() {
    const resDaftarShift = await fetch('http://localhost:3000/api/shift_handler');
    const data_shift = await resDaftarShift.json();
    return data_shift;
}

async function dashboard() {
    state.currentPage = 'dashboard';
    console.log('state : ', state.currentPage);
    document.getElementById('add-data-guidance').textContent = 'Add Report +';
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

    const shiftSelect = document.getElementById('aside-shift');
    const selectedShift = shiftSelect.value;
    shiftSelect.addEventListener('change', dashboard);

    const target = document.getElementById('table-data-pasien-sabr');
    if (selectedShift) {
        const filteredData = data_sabr.filter((sabr) => sabr.shift === selectedShift);
        const date = document.getElementById('date-input').value;
        const filteredDataByDate = filteredData.filter((sabr) => sabr.date === date);
        target.innerHTML = filteredData
        .map(
            (sabr) => `
                        <div id="data-sabr-wrapper" class="pt-1 pb-1">
                            <div id="" class="bg-white p-4 grid grid-cols-8 gap-4 w-full">
                                <h2 id="${sabr.id_report + '-tanggal'}" class="text-left">${sabr.tanggal_shift}</h2>
                                <h2 id="${sabr.id_report + '-nama'}" class="text-left">${data_pasien.find((pasien) => pasien.id_pasien === sabr.pasien_id)?.nama || 'N/A'}</h2>
                                <h2 id="${sabr.id_report + '-situation'}" class="text-justify col-span-2">${sabr.situation}</h2>
                                <h2 id="${sabr.id_report + '-background'}" class="text-justify">${sabr.background}</h2>
                                <h2 id="${sabr.id_report + '-assessment'}" class="text-justify">${sabr.assessment}</h2>
                                <h2 id="${sabr.id_report + '-recommendation'}" class="text-justify">${sabr.recommendation}</h2>
                                <div id="action" class="flex space-x-4 justify-center place-self-start">
                                    <button class="max-w-5 h-auto cursor-pointer" id="" onclick="modalEditData('${sabr.id_report}')">
                                        <img src="src/asset/logo/edit.png" alt="" class="">
                                    </button>
                                    <button class="max-w-5 h-auto cursor-pointer" id="" onclick="modalDeleteData('${sabr.id_report}')">
                                        <img src="src/asset/logo/delete.png" alt="" class="">
                                    </button>
                                </div>
                            </div>
                        </div>    
                    `,
        )
        .join('');
    } else {
        const date = document.getElementById('date-input').value;
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
    state.currentPage = 'daftar-pegawai';    
    console.log('state : ', state.currentPage);

    document.getElementById('add-data-guidance').textContent = 'Add Pegawai +';
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
                <div id="" class="bg-white p-4 grid grid-cols-3 gap-4 w-full">
                    <h2 id="${pegawai.id_pegawai + '-nama'}" class="text-left">${pegawai.nama}</h2>
                    <h2 id="${pegawai.id_pegawai + '-kode'}" class="text-left">${pegawai.kode}</h2>
                    <div id="action" class="flex space-x-4 justify-center place-self-end">
                        <button class="max-w-5 h-auto cursor-pointer" id="" onclick="modalEditData('${pegawai.id_pegawai}')">
                            <img src="src/asset/logo/edit.png" alt="" class="">
                        </button>
                        <button class="max-w-5 h-auto cursor-pointer" id="" onclick="modalDeleteData('${pegawai.id_pegawai}')">
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
    state.currentPage = 'daftar-pasien';
    console.log('state : ', state.currentPage);
    document.getElementById('add-data-guidance').textContent = 'Add Pasien +';
    document.getElementById('modal-add-data-report').classList.add('hidden');
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
                    <h2 id="${pasien.id_pasien + '-id'}" class="text-left">${pasien.id_pasien}</h2>
                    <h2 id="${pasien.id_pasien + '-nama'}" class="text-left">${pasien.nama}</h2>
                    <h2 id="${pasien.id_pasien + '-umur'}" class="text-left">${pasien.umur}</h2>
                    <div id="action" class="flex space-x-4 justify-center place-self-end">
                        <button class="max-w-5 h-auto cursor-pointer" id="" onclick="modalEditData('${pasien.id_pasien}')">
                            <img src="src/asset/logo/edit.png" alt="" class="">
                        </button>
                        <button class="max-w-5 h-auto cursor-pointer" id="" onclick="modalDeleteData('${pasien.id_pasien}')">
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
        const date = document.getElementById('date-input').value;
        const filteredDataByDate = filteredData.filter((sabr) => sabr.date === date);
        target.innerHTML = filteredData.map(
            (sabr) => `
                <div id="data-sabr-wrapper" class="pt-1 pb-1">
                    <div id="" class="bg-white p-4 grid grid-cols-8 gap-4 w-full">
                        <h2 id="${sabr.id_report + '-tanggal'}" class="text-center">${sabr.tanggal_shift}</h2>
                        <h2 id="${sabr.id_report + '-nama'}" class="text-center">${data_pasien.find((pasien) => pasien.id_pasien === sabr.pasien_id)?.nama || 'N/A'}</h2>
                        <h2 id="${sabr.id_report + '-shift'}" class="text-left">${sabr.shift}</h2>
                        <h2 id="${sabr.id_report + '-situation'}" class="text-justify">${sabr.situation}</h2>
                        <h2 id="${sabr.id_report + '-background'}" class="text-justify">${sabr.background}</h2>
                        <h2 id="${sabr.id_report + '-assessment'}" class="text-justify">${sabr.assessment}</h2>
                        <h2 id="${sabr.id_report + '-recommendation'}" class="text-justify">${sabr.recommendation}</h2>
                        <div id="action" class="flex space-x-4 justify-center place-self-start">
                            <button class="max-w-5 h-auto cursor-pointer" id="" onclick="modalEditData('${sabr.id_report}')">
                                <img src="src/asset/logo/edit.png" alt="" class="">
                            </button>
                            <button class="max-w-5 h-auto cursor-pointer" id="" onclick="modalDeleteData('${sabr.id_report}')">
                                <img src="src/asset/logo/delete.png" alt="" class="">
                            </button>
                        </div>
                    </div>
                </div>    
            `,
            )
            .join('');
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
    console.log('state : ', state.currentPage);
    let data_pasien = await fetchDataPasien();
    if (state.currentPage === 'dashboard') {
        // Handle the case for other pages
        document.getElementById('modal-add-data-report').classList.remove('hidden');
        const nameSelect = document.getElementById('pasien-name');
        nameSelect.innerHTML = data_pasien
            .map((pasien) => `<option value="${pasien.nama}">${pasien.nama}</option>`)
            .join('');
    }
    else if (state.currentPage === 'daftar-pegawai') {
        document.getElementById('modal-add-pegawai').classList.remove('hidden');
    } 
    else if (state.currentPage === 'daftar-pasien') {
        document.getElementById('modal-add-pasien').classList.remove('hidden');
    }
}

async function modalEditData(id) {
    let data_pasien = await fetchDataPasien();
    let data_sabr = await fetchDataSabr();        
    let data_pegawai = await fetchDataPegawai();
    if (state.currentPage === 'dashboard') {
        document.getElementById('modal-add-data-report').classList.remove('hidden');
        const nameOptionList = document.getElementById('pasien-name'); 
        nameOptionList.innerHTML = data_pasien
            .map((pasien) => `
                <option value="${pasien.nama}">${pasien.nama}</option>`)
            .join('');
        let dataEdit = data_sabr.find((sabr) => sabr.id_report === id);
        let dateFormatting = new Date(dataEdit.tanggal_shift);
        dateFormatting = dateFormatting.toISOString().split('T')[0];
        document.getElementById('modal-shift-selector').value = dataEdit.shift;
        document.getElementById('date-input').value = dateFormatting;
        document.getElementById('situation-input').value = dataEdit.situation;
        document.getElementById('background-input').value = dataEdit.background;
        document.getElementById('assessment-input').value = dataEdit.assessment;
        document.getElementById('recommendation-input').value = dataEdit.recommendation;
        document.getElementById('pasien-name').value = data_pasien.find((pasien) => pasien.id_pasien === dataEdit.pasien_id).nama;
    }
    else if (state.currentPage === 'daftar-pegawai') {
        let editPegawai = data_pegawai.find((pegawai) => pegawai.id_pegawai === id);
        document.getElementById('pegawai-nama').value = editPegawai.nama;
        document.getElementById('pegawai-kode').value = editPegawai.kode;
        document.getElementById('pegawai-status').value = editPegawai.status;
        document.getElementById('modal-add-pegawai').classList.remove('hidden');
    } 
    else if (state.currentPage === 'daftar-pasien') {
        let editPasien = data_pasien.find((pasien) => pasien.id_pasien === id);
        document.getElementById('pasien-nama').value = editPasien.nama;
        document.getElementById('pasien-umur').value = editPasien.umur;
        document.getElementById('pasien-status').value = editPasien.status;
        document.getElementById('modal-add-pasien').classList.remove('hidden');
    
    }
}

async function modalDeleteData(id) {
    document.getElementById('modal-delete').classList.remove('hidden');
}

// calendar
let calendar;

document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('navbar-content-calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        height: 315,
        dateClick: function(info) {
            var dateFormatting = info.date;
            console.log(dateFormatting);
            document.getElementById('date-selected-data').innerHTML = 'Selected Date : ' + dateFormatting.toLocaleDateString('id-ID', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric', 
            });
            calendarEl.querySelector('.chosen-date')?.classList.remove('chosen-date');                        
            info.dayEl.classList.add('chosen-date');
            return dateFormatting;
        },
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
    const autoFillDate = document.getElementById('date-input');
    const dateFormatting = calendar.getDate();
    console.log(dateFormatting);
    document.getElementById('date-selected-data').innerHTML = 'Selected Date : ' + dateFormatting.toLocaleDateString('id-ID', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
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
