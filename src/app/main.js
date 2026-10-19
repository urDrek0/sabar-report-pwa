// alert("Aplikasi Masih dalam Pengembangan, untuk segala kendala silahkan dilaporkan, diperhatikan juga untuk aplikasi tidak sampai ke ke tangan lain")
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
let todayDate = new Date().toLocaleDateString('en-CA')
let state = {
    currentPage: 'dashboard',
    selectedDate: todayDate
}
console.log('selectedDate:', state.selectedDate, typeof state.selectedDate);
let calendar;

document.addEventListener('DOMContentLoaded', 
    function () {
    const calendarEl = document.getElementById('navbar-content-calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        height: 315,
        dateClick: function(info) {
            var dateFormatting = info.date;
            document.getElementById('date-selected-data').innerHTML = 'PJ pada : ' + dateFormatting.toLocaleDateString('id-ID', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric', 
            });
            calendarEl.querySelector('.chosen-date')?.classList.remove('chosen-date');
            calendarEl.querySelector('.chosen-date-label')?.classList.remove('chosen-date-label');
            info.dayEl.classList.add('chosen-date');
            info.dayEl.querySelector('[aria-hidden="true"], a')?.classList.add('chosen-date-label');
            state.selectedDate = info.dateStr
            console.log("calendar click : " + state.selectedDate, typeof state.selectedDate)
            if (state.currentPage === 'dashboard') {
                dashboard();
            }
            else if (state.currentPage === 'daftar-shift-handler') {
                showShift()
            }
            return state.selectedDate
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
    console.log("dateFormatting : " + dateFormatting);
    document.getElementById('date-selected-data').innerHTML = 'PJ pada : ' + dateFormatting.toLocaleDateString('id-ID', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
    dateNow.textContent = 'Hari Ini : ' + dateFormatting.toLocaleDateString('id-ID', {
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

    document.getElementById('shift-handler-wrapper').classList.remove('hidden');
    document.getElementById('report-title-shift-handler').classList.add('hidden');
    document.getElementById('shift-handler-join').classList.add('hidden');

    let data_sabr = await fetchDataSabr();
    let data_pasien = await fetchDataPasien();
    let data_pegawai= await fetchDataPegawai();
    let data_shift= await fetchDataShiftHandler()

    const shiftSelect = document.getElementById('aside-shift');
    const selectedShift = shiftSelect.value;
    shiftSelect.addEventListener('change', dashboard);

    const target = document.getElementById('table-data-pasien-sabr');
    const targetShift = document.getElementById('shift-handler-on-dashboard')
    if (selectedShift) {
        const filteredData = data_sabr.filter((sabr) => sabr.shift === selectedShift);
        const filteredDataByDate = filteredData.filter((sabr) => sabr.tanggal_shift.slice(0,10) === state.selectedDate);
        console.log("inside dashboard : ", state.selectedDate)
        target.innerHTML = filteredDataByDate
        .map(
            (sabr) => `
                        <div id="data-sabr-wrapper" class="pt-1 pb-1">
                            <div id="" class="bg-white p-4 grid grid-cols-8 gap-4 w-full">
                                <h2 id="${sabr.id_report + '-nama'}" class="text-left">${data_pasien.find((pasien) => pasien.id_pasien === sabr.pasien_id)?.nama || 'N/A'}</h2>
                                <h2 id="${sabr.id_report + '-situation'}" class="text-justify col-span-2">${sabr.situation}</h2>
                                <h2 id="${sabr.id_report + '-background'}" class="text-justify">${sabr.background}</h2>
                                <h2 id="${sabr.id_report + '-assessment'}" class="text-justify col-span-2">${sabr.assessment}</h2>
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
        ).join('');
        const roleConverter = data_shift.map((shift) => {
            if (shift.shift_leader === true) {
                shift.shift_leader = 'Shift Leader';
            }else if (shift.shift_leader === false) {
                shift.shift_leader = 'Shift Member';
            }
            return shift;
        });
        const filterdataShift = roleConverter.filter((shift) => shift.shift === selectedShift);
        const filterdataShiftbyDate = filterdataShift.filter((shift) => shift.tanggal_shift.slice(0,10) === state.selectedDate)
        targetShift.innerHTML = filterdataShiftbyDate.map(
            (shift) => `
                <div id="" class="grid grid-cols-5 gap-4">
                    <h1 id="${shift.id_shift + '-nama'}" class="col-span-2 text-sm text-left p-2">${data_pegawai.find(p => p.id_pegawai === shift.pegawai_id)?.nama || 'N/A'}</h1>
                    <h1 id="${shift.id_shift + '-shift'}" class="text-sm text-left p-2">${shift.shift}</h1>
                    <h1 id="${shift.id_shift + '-role'}" class="col-span-2 text-sm text-left p-2">${shift.shift_leader}</h1>
                </div>
            `
        ).join('');
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
    console.log("inside daftarPegawai : ", state.selectedDate)
    document.getElementById('add-data-guidance').textContent = 'Add Pegawai +';
    document.getElementById('table-data-pasien-sabr').classList.add('hidden');
    document.getElementById('report-title-dashboard').classList.add('hidden');
    document.getElementById('table-header-dashboard').classList.add('hidden');
    document.getElementById('modal-add-shift-handler').classList.add('hidden');

    document.getElementById('daftar-pegawai').classList.remove('hidden');
    document.getElementById('table-data-daftar-pegawai').classList.remove('hidden');
    document.getElementById('report-title-pegawai').classList.remove('hidden');
    document.getElementById('table-header-pegawai').classList.remove('hidden');

    document.getElementById('daftar-pasien').classList.add('hidden');
    document.getElementById('report-title-pasien').classList.add('hidden');
    document.getElementById('table-header-pasien').classList.add('hidden');
    document.getElementById('table-data-daftar-pasien').classList.add('hidden');
    
    document.getElementById('shift-handler-wrapper').classList.add('hidden');
    document.getElementById('report-title-shift-handler').classList.add('hidden');
    document.getElementById('shift-handler-join').classList.add('hidden');

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
    document.getElementById('modal-add-data-report').classList.add('hidden');

    document.getElementById('table-data-pasien-sabr').classList.add('hidden');
    document.getElementById('report-title-dashboard').classList.add('hidden');
    document.getElementById('table-header-dashboard').classList.add('hidden');
    
    document.getElementById('shift-handler-wrapper').classList.add('hidden');
    document.getElementById('report-title-shift-handler').classList.add('hidden');
    document.getElementById('shift-handler-join').classList.add('hidden');

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

async function addNewReport() {
    console.log('state : ', state.currentPage);
    let data_pasien = await fetchDataPasien();
    let data_pegawai = await fetchDataPegawai();
    if (state.currentPage === 'dashboard') {
        document.getElementById('modal-add-data-report').classList.remove('hidden');
        let nameSelectPasien = document.getElementById('pasien-name');
        nameSelectPasien.innerHTML = data_pasien
            .map((pasien) => `<option value="${pasien.nama}">${pasien.nama}</option>`)
            .join('');
    }
    else if (state.currentPage === 'daftar-pegawai') {
        document.getElementById('modal-add-pegawai').classList.remove('hidden');
    } 
    else if (state.currentPage === 'daftar-pasien') {
        document.getElementById('modal-add-pasien').classList.remove('hidden');
    }
    else if (state.currentPage === 'daftar-shift-handler') {
        document.getElementById('modal-add-shift-handler').classList.remove('hidden');
        let nameSelectPegawai = document.getElementById('shift-handler-nama');
        nameSelectPegawai.innerHTML = data_pegawai
            .map((pegawai) => `<option value="${pegawai.nama}">${pegawai.nama}</option>`)
            .join('');
    }
}

async function modalEditData(id) {
    let data_pasien = await fetchDataPasien();
    let data_sabr = await fetchDataSabr();        
    let data_pegawai = await fetchDataPegawai();
    let data_shift = await fetchDataShiftHandler();
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
        if (editPegawai.aktif === true) {
            editPegawai.aktif = 'Aktif';
        } else {
            editPegawai.aktif = 'Tidak Aktif';
        }
        document.getElementById('pegawai-nama').value = editPegawai.nama;
        document.getElementById('pegawai-kode').value = editPegawai.kode;
        document.getElementById('pegawai-status').value = editPegawai.aktif;
        document.getElementById('modal-add-pegawai').classList.remove('hidden');
    } 
    else if (state.currentPage === 'daftar-shift-handler') {
        let editShiftHandler = data_shift.find((handler) => handler.id_shift === id);
        let nameSelectPegawai = document.getElementById('shift-handler-nama');
        nameSelectPegawai.innerHTML = data_pegawai
            .map((pegawai) => `<option value="${pegawai.nama}">${pegawai.nama}</option>`)
            .join('');
        document.getElementById('shift-handler-nama').value = data_pegawai.find((p) => p.id_pegawai === editShiftHandler.pegawai_id)?.nama;
        document.getElementById('shift-handler-shift').value = editShiftHandler.shift
        document.getElementById('shift-handler-role').value = editShiftHandler.shift_leader;
        document.getElementById('modal-add-shift-handler').classList.remove('hidden');
    }
    else if (state.currentPage === 'daftar-pasien') {
        let editPasien = data_pasien.find((pasien) => pasien.id_pasien === id);
        if (editPasien.aktif === true) {
            editPasien.aktif = 'Aktif';
        } else {
            editPasien.aktif = 'Tidak Aktif';
        }
        document.getElementById('pasien-nama').value = editPasien.nama;
        document.getElementById('pasien-umur').value = editPasien.umur;
        document.getElementById('pasien-status').value = editPasien.aktif;
        document.getElementById('modal-add-pasien').classList.remove('hidden');
    
    }
}

async function modalDeleteData(id) {
    document.getElementById('modal-delete').classList.remove('hidden');
}

async function showShift() {
    state.currentPage = 'daftar-shift-handler';
    console.log('state : ', state.currentPage);
    document.getElementById('add-data-guidance').textContent = 'Add Shift Handler +';
    document.getElementById('modal-add-data-report').classList.add('hidden');
    document.getElementById('daftar-pegawai').classList.add('hidden');
    document.getElementById('table-data-daftar-pegawai').classList.add('hidden');
    document.getElementById('report-title-pegawai').classList.add('hidden');
    document.getElementById('table-header-pegawai').classList.add('hidden');

    document.getElementById('table-data-pasien-sabr').classList.add('hidden');
    document.getElementById('report-title-dashboard').classList.add('hidden');
    document.getElementById('table-header-dashboard').classList.add('hidden');

    document.getElementById('daftar-pasien').classList.add('hidden');
    document.getElementById('report-title-pasien').classList.add('hidden');
    document.getElementById('table-header-pasien').classList.add('hidden');
    document.getElementById('table-data-daftar-pasien').classList.add('hidden');
    
    document.getElementById('shift-handler-wrapper').classList.add('hidden');
    document.getElementById('report-title-shift-handler').classList.remove('hidden');
    document.getElementById('shift-handler-join').classList.remove('hidden');


    let data_shift = await fetchDataShiftHandler();
    let data_pegawai = await fetchDataPegawai();
    const roleConverter = data_shift.map((shift) => {
        if (shift.shift_leader === true) {
            shift.shift_leader = 'Shift Leader';
        }else if (shift.shift_leader === false) {
            shift.shift_leader = 'Shift Member';
        }
        return shift;
    });

    const shiftSelect = document.getElementById('aside-shift');
    const selectedShift = shiftSelect.value;
    shiftSelect.addEventListener('change', showShift);

    if (selectedShift) {
        const filterdataShift = roleConverter.filter((shift) => shift.shift === selectedShift);
        const filterdataShiftbyDate = filterdataShift.filter((shift) => shift.tanggal_shift.slice(0,10) === state.selectedDate)
        const shiftHandlerJoin = document.getElementById('table-data-shift-handler');
        shiftHandlerJoin.innerHTML = filterdataShiftbyDate
            .map(
                (shift) => `
            <div id="data-shift-wrapper" class="pt-1 pb-1">
                <div id="" class="bg-white p-4 grid grid-cols-6 gap-4 w-full">
                    <h1 id="${shift.id_shift + '-tanggal'}" class="text-md text-left">${shift.tanggal_shift.slice(0,10)}</h1>
                    <h1 id="${shift.id_shift + '-shift'}" class="text-md text-left">${shift.shift}</h1>
                    <h1 id="${shift.id_shift + '-nama'}" class="text-md text-left">${data_pegawai.find(p => p.id_pegawai === shift.pegawai_id)?.nama || 'N/A'}</h1>
                    <h1 id="${shift.id_shift + '-kode'}" class="text-md text-left">${data_pegawai.find(p => p.id_pegawai === shift.pegawai_id)?.kode || 'N/A'}</h1>
                    <h1 id="${shift.id_shift + '-role'}" class="text-md text-left">${shift.shift_leader}</h1>
                    <div id="action" class="flex space-x-4 justify-center">
                        <button class="max-w-5 h-auto cursor-pointer" id="" onclick="modalEditData('${shift.id_shift}')">
                            <img src="src/asset/logo/edit.png" alt="" class="">
                        </button>
                        <button class="max-w-5 h-auto cursor-pointer" id="" onclick="modalDeleteData('${shift.id_shift}')">
                            <img src="src/asset/logo/delete.png" alt="" class="">
                        </button>
                    </div>
                </div>
            </div>
                `,
            )
            .join('');
}}