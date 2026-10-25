const API_URL = 'https://sabr-backend.vercel.app'
alert("Aplikasi Masih dalam Pengembangan, untuk segala kendala silahkan dilaporkan, diperhatikan juga untuk aplikasi tidak sampai ke ke tangan lain")
async function fetchDataPasien() {
    const resDaftarPasien = await fetch(`${API_URL}/api/pasien`);
    const data_pasien = await resDaftarPasien.json();
    return data_pasien;
}
async function fetchDataPegawai() {
    const resDaftarPasien = await fetch(`${API_URL}/api/pegawai`);
    const data_pegawai = await resDaftarPasien.json();
    return data_pegawai;
}
async function fetchDataSabr() {
    const resDaftarSabr = await fetch(`${API_URL}/api/sabr_report`);
    const data_sabr = await resDaftarSabr.json();
    return data_sabr;
}
async function fetchDataShiftHandler() {
    const resDaftarShift = await fetch(`${API_URL}/api/shift_handler`);
    const data_shift = await resDaftarShift.json();
    return data_shift;
}
var todayDate = new Date().toLocaleDateString('en-CA')

let state = {
    currentPage: 'dashboard',
    selectedDate: todayDate,
    selectedShift: 'pagi',
    dataReport: [],
    dataShift: [],
    dataPegawai: [],
    dataPasien: [],
    idToDelete: null,
    deleteType: null,
    editId: null
}

async function initData() {
    try {
        state.dataReport = await fetchDataSabr()
        state.dataShift = await fetchDataShiftHandler()
        state.dataPegawai = await fetchDataPegawai()
        state.dataPasien = await fetchDataPasien()
    }catch(error){
        console.error("Gagal Inisialisasi Data : ", error)
    }
}

let calendar;

function renderCurrentPage(){
    if (state.currentPage === 'dashboard') {dashboard()}
    else if (state.currentPage === 'daftar-shift-handler') {showShift()}
}
function safeHTMLConvert(str){
    if (typeof str !== 'string') return str;
    return str.replace(/[$<>'"]/g, function(tag){
        const charsToReplace ={
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }
        return charsToReplace[tag]
    })
}
document.addEventListener('DOMContentLoaded', async function () {
    const calendarEl = document.getElementById('navbar-content-calendar');
    const shiftSelect = document.getElementById('aside-shift')

    shiftSelect.addEventListener('change', () => {
        state.selectedShift = shiftSelect.value
        renderCurrentPage()
    })

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
        renderCurrentPage()
        },
    headerToolbar: {left: 'prev', center: 'title',right: 'next'},
    footerToolbar: {left: 'prevYear', center: 'today', right: 'nextYear'},
    titleFormat: { year: 'numeric', month: 'short'},
});
calendar.render();
    const dateNow = document.getElementById('today-date');
    const autoFillDate = document.getElementById('date-input');
    const dateFormatting = calendar.getDate();
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
    await initData()
    renderCurrentPage()
});

function toggleSideBar() {
    const idToggled = ['aside-home','today-date','aside-calendar', 'calendar-wrapper', 'aside-shift','aside-shift-text','aside-pegawai','aside-pasien','prevMonth','nextMonth',];
    idToggled.forEach(id => document.getElementById(id)?.classList.toggle('hidden'))
    document.getElementById('sidebar-container').classList.toggle('pr-4');
}

function dashboard() {
    state.currentPage = 'dashboard';
    document.getElementById('app-guide').classList.add('top-38/40')
    document.getElementById('app-guide').classList.add('left-58/60')

    let data_sabr = state.dataReport;
    let data_pasien = state.dataPasien;
    let data_pegawai = state.dataPegawai;
    let data_shift = state.dataShift;

    let hideElementbyId = ['daftar-pegawai', 'table-data-daftar-pegawai','report-title-pegawai','table-header-pegawai','daftar-pasien','report-title-pasien','table-header-pasien','table-data-daftar-pasien','report-title-shift-handler','shift-handler-join']
    let shownElementbyId = ['table-data-pasien-sabr','report-title-dashboard','table-header-dashboard','shift-handler-wrapper']

    document.getElementById('add-data-guidance').textContent = 'Add Report +';
    hideElementbyId.forEach(id => document.getElementById(id)?.classList.add('hidden'))
    shownElementbyId.forEach(id => document.getElementById(id)?.classList.remove('hidden'))

    const target = document.getElementById('table-data-pasien-sabr');
    const targetShift = document.getElementById('shift-handler-on-dashboard')

    const filteredData = data_sabr.filter((sabr) => sabr.shift === state.selectedShift);
    const filteredDataByDate = filteredData.filter((sabr) => sabr.tanggal_shift.slice(0,10) === state.selectedDate);

    target.innerHTML = filteredDataByDate.map(
        (sabr) => `
            <div id="data-sabr-wrapper" class="pt-1 pb-1">
                <div id="" class="bg-white p-4 grid grid-cols-8 gap-4 w-full">
                    <h2 id="${sabr.id_report + '-nama'}" class="text-left">${data_pasien.find((pasien) => pasien.id_pasien === sabr.pasien_id)?.nama || 'N/A'}</h2>
                    <h2 id="${sabr.id_report + '-situation'}" class="text-justify col-span-2">${safeHTMLConvert(sabr.situation)}</h2>
                    <h2 id="${sabr.id_report + '-background'}" class="text-justify">${safeHTMLConvert(sabr.background)}</h2>
                    <h2 id="${sabr.id_report + '-assessment'}" class="text-justify col-span-2">${safeHTMLConvert(sabr.assessment)}</h2>
                    <h2 id="${sabr.id_report + '-recommendation'}" class="text-justify">${safeHTMLConvert(sabr.recommendation)}</h2>
                    <div id="action" class="flex space-x-4 justify-center place-self-start">
                    <button class="max-w-5 h-auto cursor-pointer" id="" onclick="modalEditData('${sabr.id_report}'), type = 'sabr'">
                        <img src="./logo/edit.png" alt="" class="">
                    </button>
                    <button class="max-w-5 h-auto cursor-pointer" id="" onclick="modalDeleteData('${sabr.id_report}', type = 'sabr')">
                        <img src="./logo/delete.png" alt="" class="">
                    </button>
                    </div>
                </div>
            </div>    `,).join('');

    const filterdataShift = data_shift.filter((shift) => shift.shift === state.selectedShift);
    const filterdataShiftbyDate = filterdataShift.filter((shift) => shift.tanggal_shift.slice(0,10) === state.selectedDate)
    targetShift.innerHTML = filterdataShiftbyDate.map(
        (shift) => `
            <div id="" class="grid grid-cols-4 gap-4">
                <h1 id="${shift.id_shift + '-nama'}" class="col-span-2 text-sm text-left p-2">${data_pegawai.find(p => p.id_pegawai === shift.pegawai_id)?.nama || 'N/A'}</h1>
                <h1 id="${shift.id_shift + '-role'}" class="col-span-2 text-sm text-left p-2">${shift.shift_leader ? 'Leader' : 'Member'}</h1>
            </div>`).join('');
}

function showShift() {
    state.currentPage = 'daftar-shift-handler';
    document.getElementById('app-guide').classList.add('top-38/40')
    document.getElementById('app-guide').classList.add('left-48/50')

    let data_shift = state.dataShift
    let data_pegawai = state.dataPegawai
    let hideElementbyId = ['modal-add-data-report','daftar-pegawai','table-data-daftar-pegawai','report-title-pegawai','table-header-pegawai','table-data-pasien-sabr','report-title-dashboard','table-header-dashboard','daftar-pasien','report-title-pasien','table-header-pasien','table-data-daftar-pasien','shift-handler-wrapper']
    let shownElementbyId = ['report-title-shift-handler', 'shift-handler-join']

    document.getElementById('add-data-guidance').textContent = 'Add Shift Handler +';
    hideElementbyId.forEach(id => document.getElementById(id)?.classList.add('hidden'))
    shownElementbyId.forEach(id => document.getElementById(id)?.classList.remove('hidden'))

    const filterdataShift = data_shift.filter((shift) => shift.shift === state.selectedShift);
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
                    <h1 id="${shift.id_shift + '-role'}" class="text-md text-left">${shift.shift_leader ? 'Leader' : 'Member'}</h1>
                    <div id="action" class="flex space-x-4 justify-center">
                        <button class="max-w-5 h-auto cursor-pointer" id="" onclick="modalEditData('${shift.id_shift}', type = 'shift-team')">
                            <img src="./logo/edit.png" alt="" class="">
                        </button>
                        <button class="max-w-5 h-auto cursor-pointer" id="" onclick="modalDeleteData('${shift.id_shift}', type = 'shift-team')">
                            <img src="./logo/delete.png" alt="" class="">
                        </button>
                    </div>
                </div>
            </div>`,).join('');
}

function daftarPegawai() {
    state.currentPage = 'daftar-pegawai';    
    document.getElementById('app-guide').classList.remove('top-38/40')
    document.getElementById('app-guide').classList.add('top-1/21')
    
    let hideElementbyId = ['table-data-pasien-sabr', 'report-title-dashboard', 'table-header-dashboard', 'modal-add-shift-handler', 'daftar-pasien', 'report-title-pasien', 'table-header-pasien','table-data-daftar-pasien', 'shift-handler-wrapper', 'report-title-shift-handler','shift-handler-join']
    let shownElementbyId = ['daftar-pegawai', 'table-data-daftar-pegawai', 'report-title-pegawai', 'table-header-pegawai'] 
    document.getElementById('add-data-guidance').textContent = 'Add Pegawai +';
    hideElementbyId.forEach(id => document.getElementById(id)?.classList.add('hidden'))
    shownElementbyId.forEach(id => document.getElementById(id)?.classList.remove('hidden'))

    let data_pegawai = state.dataPegawai
    const target = document.getElementById('table-data-daftar-pegawai');

    target.innerHTML = data_pegawai
    .filter((pegawai) => pegawai.aktif === true)
        .map(
        (pegawai) => `
            <div id="data-pegawai-wrapper" class="pt-1 pb-1">
                <div id="" class="bg-white p-4 grid grid-cols-5 gap-4 w-full">
                    <h2 id="${pegawai.id_pegawai + '-nama'}" class="text-left col-span-2">${safeHTMLConvert(pegawai.nama)}</h2>
                    <h2 id="${pegawai.id_pegawai + '-kode'}" class="text-left">${safeHTMLConvert(pegawai.kode)}</h2>
                    <h2 id="${pegawai.id_pegawai + '-aktif'}" class="text-left">${pegawai.aktif ? 'Aktif' : 'Tidak Aktif'}</h2>
                    <div id="action" class="flex space-x-4 justify-center place-self-end">
                        <button class="max-w-5 h-auto cursor-pointer" id="" onclick="modalEditData('${pegawai.id_pegawai}', type ='pegawai')">
                            <img src="./logo/edit.png" alt="" class="">
                        </button>
                        <button class="max-w-5 h-auto cursor-pointer" id="" onclick="modalDeleteData('${pegawai.id_pegawai}', type ='pegawai')">
                            <img src="./logo/delete.png" alt="" class="">
                        </button>
                    </div>
                </div>
            </div>    
                `,
        )
        .join('');
}

function daftarPasien() {
    state.currentPage = 'daftar-pasien';
    document.getElementById('app-guide').classList.remove('top-38/40')
    document.getElementById('app-guide').classList.add('top-1/21')

    let hideElementbyId = ['modal-add-data-report', 'daftar-pegawai', 'table-data-daftar-pegawai', 'report-title-pegawai', 'table-header-pegawai', 'modal-add-data-report', 'table-data-pasien-sabr', 'report-title-dashboard', 'table-header-dashboard', 'shift-handler-wrapper', 'report-title-shift-handler', 'shift-handler-join']
    let shownElementbyId = ['daftar-pasien', 'report-title-pasien', 'table-header-pasien', 'table-data-daftar-pasien'] 
    hideElementbyId.forEach(id => document.getElementById(id)?.classList.add('hidden'))
    shownElementbyId.forEach(id => document.getElementById(id)?.classList.remove('hidden'))
    document.getElementById('add-data-guidance').textContent = 'Add Pasien +';

    let data_pasien = state.dataPasien
    const target = document.getElementById('table-data-daftar-pasien');

    target.innerHTML = data_pasien
        .filter((pasien) => pasien.aktif === true)
        .map(
        (pasien) => `
            <div id="data-pasien-wrapper" class="pt-1 pb-1">
                <div id="" class="bg-white p-4 grid grid-cols-5 gap-4 w-full">
                    <h2 id="${pasien.id_pasien + '-nama'}" class="text-left col-span-2">${safeHTMLConvert(pasien.nama)}</h2>
                    <h2 id="${pasien.id_pasien + '-umur'}" class="text-left">${safeHTMLConvert(pasien.umur)}</h2>
                    <h2 id="${pasien.id_pasien + '-aktif'}" class="text-left">${pasien.aktif ? 'Aktif' : 'Tidak Aktif'}</h2>
                    <div id="action" class="flex space-x-4 justify-center place-self-end">
                        <button class="max-w-5 h-auto cursor-pointer" id="" onclick="modalEditData('${pasien.id_pasien}', type = 'pasien')">
                            <img src="./logo/edit.png" alt="" class="">
                        </button>
                        <button class="max-w-5 h-auto cursor-pointer" id="" onclick="modalDeleteData('${pasien.id_pasien}',type ='pasien')">
                            <img src="./logo/delete.png" alt="" class="">
                        </button>
                    </div>
                </div>
            </div>    
        `,).join('');
}

function addNewReport() {
    let data_pasien = state.dataPasien
    let data_pegawai = state.dataPegawai
    const shiftHandlerEvent = document.getElementById('shift-handler-team')
    state.editId = null;
    if (state.currentPage === 'dashboard') {
        document.getElementById('date-input').value = '';
        document.getElementById('situation-input').value = '';
        document.getElementById('background-input').value = '';
        document.getElementById('assessment-input').value = '';
        document.getElementById('recommendation-input').value = '';
        document.getElementById('modal-shift-selector').selectedIndex = 0;
        
        document.getElementById('modal-add-data-report').classList.remove('hidden');
        let nameSelectPasien = document.getElementById('pasien-name');
        nameSelectPasien.innerHTML = data_pasien
            .filter((pasien) => pasien.aktif === true)
            .map((pasien) => `<option value="${pasien.nama}">${safeHTMLConvert(pasien.nama)}</option>`)
            .join('');
    }
    else if (state.currentPage === 'daftar-pegawai') {
        document.getElementById('pegawai-nama').value = '';
        document.getElementById('pegawai-kode').value = '';
        document.getElementById('pegawai-status').value = 'true';
        document.getElementById('modal-add-pegawai').classList.remove('hidden');
    } 
    else if (state.currentPage === 'daftar-pasien') {
        document.getElementById('pasien-nama').value = '';
        document.getElementById('pasien-umur').value = '';
        document.getElementById('pasien-status').value = 'true';
        document.getElementById('modal-add-pasien').classList.remove('hidden');
    }
    else if (state.currentPage === 'daftar-shift-handler') {
        shiftHandlerEvent.selectedIndex = 0;
        document.getElementById('shift-handler-shift').selectedIndex = 0;
        document.getElementById('shift-handler-date-input').value = '';
        
        document.getElementById('modal-add-shift-handler').classList.remove('hidden');
        let idPuller = ['shift-handler-nama-one', 'shift-handler-nama-two', 'shift-handler-nama-three', 'shift-handler-nama-four', 'shift-handler-nama-five']
        
        idPuller.forEach((idPlaceHolder) => 
            document.getElementById(idPlaceHolder).innerHTML = data_pegawai
            .filter((pegawai) => pegawai.aktif === true)
            .map((pegawai) => `<option value="${pegawai.nama}">${safeHTMLConvert(pegawai.nama)}</option>`).join('')
        )
        let fieldFormId = ['field-form-shift-handler-one','field-form-shift-handler-two','field-form-shift-handler-three','field-form-shift-handler-four','field-form-shift-handler-five',]  
        fieldFormId.forEach((id) => {
            document.getElementById(id).classList.add('hidden');
        });
        function renderingFieldFrom(){
            const valueTeamOnShift = shiftHandlerEvent.value
            fieldFormId.forEach((id, index) => {
                document.getElementById(id).classList.toggle('hidden', index >= valueTeamOnShift)
            })
        }
    }
    shiftHandlerEvent.addEventListener('change', renderingFieldFrom)               
}
 
function modalEditData(id) {
    let data_pasien = state.dataPasien
    let data_sabr = state.dataReport     
    let data_pegawai = state.dataPegawai
    let data_shift = state.dataShift
    state.editId = id
    if (state.currentPage === 'dashboard') {
        document.getElementById('modal-add-data-report').classList.remove('hidden');
        const nameOptionList = document.getElementById('pasien-name'); 
        nameOptionList.innerHTML = data_pasien
            .map((pasien) => `
                <option value="${pasien.nama}">${safeHTMLConvert(pasien.nama)}</option>`)
            .join('');
        let dataEdit = data_sabr.find((sabr) => sabr.id_report == state.editId);
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
        let editPegawai = data_pegawai.find((pegawai) => pegawai.id_pegawai == state.editId);
        document.getElementById('pegawai-nama').value = editPegawai.nama;
        document.getElementById('pegawai-kode').value = editPegawai.kode;
        document.getElementById('pegawai-status').value = editPegawai.aktif
        document.getElementById('modal-add-pegawai').classList.remove('hidden');
    } 
    else if (state.currentPage === 'daftar-shift-handler') {
        document.getElementById('modal-edit-shift-singular').classList.remove('hidden');
        let editShiftHandler = data_shift.find((handler) => handler.id_shift == state.editId);
        let nameSelectPegawai = document.getElementById('shift-handler-nama-edit');
        nameSelectPegawai.innerHTML = data_pegawai.map((pegawai) => 
            `<option value="${pegawai.nama}">${safeHTMLConvert(pegawai.nama)}</option>`)
            .join('');
        document.getElementById('shift-handler-nama-edit').value = data_pegawai.find((p) => p.id_pegawai === editShiftHandler.pegawai_id)?.nama;
        document.getElementById('shift-handler-shift-edit').value = editShiftHandler.shift
        document.getElementById('shift-handler-role-edit').value = editShiftHandler.shift_leader;
    }
    else if (state.currentPage === 'daftar-pasien') {
        let editPasien = data_pasien.find((pasien) => pasien.id_pasien == state.editId);
        document.getElementById('pasien-nama').value = editPasien.nama;
        document.getElementById('pasien-umur').value = editPasien.umur;
        document.getElementById('pasien-status').value = editPasien.aktif;
        document.getElementById('modal-add-pasien').classList.remove('hidden');
    }
}

async function submitNewReport() {
    if (state.currentPage === "dashboard"){
        const namaPasien = document.getElementById('pasien-name').value
        const shift = document.getElementById('modal-shift-selector').value
        const tanggalShift = document.getElementById('date-input').value
        const situation = document.getElementById('situation-input').value
        const background = document.getElementById('background-input').value
        const assessment = document.getElementById('assessment-input').value
        const recommendation = document.getElementById('recommendation-input').value

        if (!namaPasien || !shift || !tanggalShift){
            alert("Nama Pasien, Shift, dan Tanggal harus diisi!")
            return;
        }

        let data_pasien = state.dataPasien
        const pasien = data_pasien.find(p => p.nama === namaPasien)

        if(!pasien){
            alert("Pasien Tidak Ditemukan!")
            return;
        }

        const payload = {
            tanggal_shift: tanggalShift,
            shift: shift,
            pasien_id: pasien.id_pasien,
            situation: situation,
            background: background,
            assessment: assessment,
            recommendation: recommendation
        }

        try{
            let endpoint = `${API_URL}/api/sabr_report`
            let method = 'POST'

            if(state.editId){
                endpoint = `${API_URL}/api/sabr_report/${state.editId}`
                method = 'PUT'
            }
            const response = await fetch(endpoint, {
                method: method,
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload)
            })
            if(!response.ok){
                const errorData = await response.json();
                alert(`Gagal: ${errorData.error || 'Terjadi kesalahan saat menyimpan data.'}`);
                return;
            }
            if(response.ok){
                document.getElementById('modal-add-data-report').classList.add('hidden')
                state.dataReport = await fetchDataSabr();
                alert(method === 'POST' ? "Laporan Berhasil Ditambahkan" : "Laporan Berhasil Diperbaharui")
                dashboard()
                document.getElementById('situation-input').value = '';
                document.getElementById('background-input').value = '';
                document.getElementById('assessment-input').value = '';
                document.getElementById('recommendation-input').value = '';
                state.editId = null
            }
        }catch (error){
            console.error("Error Sumbiting Report", error)
            alert("Terjadi Kesalahan Jaringan.")
        }
    }
    else if (state.currentPage === 'daftar-pegawai'){
        const namaPegawai = document.getElementById('pegawai-nama').value
        const kodePegawai = document.getElementById('pegawai-kode').value
        const statusPegawai = document.getElementById('pegawai-status').value
        if (!namaPegawai || !kodePegawai || !statusPegawai) {
            alert("Nama Pegawai, Kode Pegawai, dan Status tidak boleh kosong")
            return;
        }

        const payload = {
            nama: namaPegawai,
            kode: kodePegawai,
            aktif: statusPegawai
        }

        try{
            let endpoint = `${API_URL}/api/pegawai`
            let method = 'POST'
            if(state.editId){
                endpoint = `${API_URL}/api/pegawai/${state.editId}`
                method = 'PUT'
            }
            const response = await fetch(endpoint, {
                method: method,
                headers:{'Content-Type': 'application/json'},
                body: JSON.stringify(payload)
            })
            if(!response.ok){
                const errorData = await response.json();
                alert(`Gagal: ${errorData.error || 'Terjadi kesalahan saat menyimpan data.'}`);
                return;
            }
            if (response.ok){
                document.getElementById('modal-add-pegawai').classList.add('hidden')
                alert(method === 'POST' ? "Pegawai Berhasil Ditambahkan" : "Pegawai Berhasil Diperbaharui")
                state.dataPegawai = await fetchDataPegawai()
                daftarPegawai()
                document.getElementById('pegawai-nama').value = ""
                document.getElementById('pegawai-kode').value = ""
                document.getElementById('pegawai-status').value = "true"
                state.editId = null
            }
        }catch (error){
            console.error("Error Sumbiting Employee", error)
            alert("Terjadi Kesalahan Jaringan.")
        }
    }
    else if (state.currentPage === 'daftar-pasien'){
        const namaPasien = document.getElementById('pasien-nama').value
        const umurPasien = document.getElementById('pasien-umur').value
        const statusPasien = document.getElementById('pasien-status').value
        if (!namaPasien || !umurPasien || !statusPasien) {
            alert("Nama Pasien, Umur Pasien, dan Status tidak boleh kosong")
            return;
        }

        const payload = {
            nama: namaPasien,
            umur: umurPasien,
            aktif: statusPasien
        }

        try{
            let endpoint = `${API_URL}/api/pasien`
            let method = 'POST'

            if (state.editId){
                endpoint = `${API_URL}/api/pasien/${state.editId}`
                method = 'PUT'
            }
            const response = await fetch(endpoint, {
                method: method,
                headers:{'Content-Type': 'application/json'},
                body: JSON.stringify(payload)
            })
            if(!response.ok){
                const errorData = await response.json();
                alert(`Gagal: ${errorData.error || 'Terjadi kesalahan saat menyimpan data.'}`);
                return;
            }
            if (response.ok){
                document.getElementById('modal-add-pasien').classList.add('hidden')
                alert(method === 'POST' ? "Pasien Berhasil Ditambahkan" : "Pasien Berhasil Diperbaharui")
                state.dataPasien = await fetchDataPasien()
                daftarPasien()
                document.getElementById('pasien-nama').value = ""
                document.getElementById('pasien-umur').value = ""
                document.getElementById('pasien-status').value = "true"
                state.editId = null
            }
        }catch (error){
            console.error("Error Sumbiting Patient", error)
            alert("Terjadi Kesalahan Jaringan.")
        }
    }else if (state.currentPage === 'daftar-shift-handler'){
        let data_pegawai = state.dataPegawai
        if(state.editId){
            const namaPegawai = document.getElementById('shift-handler-nama-edit').value;
            const shiftVal = document.getElementById('shift-handler-shift-edit').value;
            const roleVal = document.getElementById('shift-handler-role-edit').value;

            const pegawaiSearch = data_pegawai.find(p => p.nama === namaPegawai);
                if (!pegawaiSearch) {
                    alert("Gagal: Nama Pegawai tidak ditemukan di database!");
                    return;
                }

            const oldData = state.dataShift.find(s => s.id_shift === state.editId);
                if (!oldData) {
                    alert("Gagal: Data Shift lama tidak ditemukan di memori!");
                    return;
                }
            const editPayload = {
                tanggal_shift: oldData.tanggal_shift,
                shift: shiftVal,
                pegawai_id: pegawaiSearch.id_pegawai,
                shift_leader: roleVal === "true"
            };
            try{
                const response = await fetch(`${API_URL}/api/shift_handler/${state.editId}`,{
                    method: 'PUT',
                    headers: {'Content-Type':'application/json'},
                    body:JSON.stringify(editPayload) 
                })

                if(!response.ok){alert("Tim Shift Gagal Diperbaharui"); return}
                alert("Tim Berhasil di Perbaharui")
                document.getElementById('modal-edit-shift-singular').classList.add('hidden');
                state.dataShift = await fetchDataShiftHandler();
                showShift();
                state.editId = null
            }catch(error){
                console.error("Error updating shift", error);
                alert("Terjadi Kesalahan Jaringan.")
            }
            return;
        }
        const jmlBatchPegawai = parseInt(document.getElementById('shift-handler-team').value)
        const shiftHandler = document.getElementById('shift-handler-shift').value
        const dateShift = document.getElementById('shift-handler-date-input').value

        const idNama = ['shift-handler-nama-one', 'shift-handler-nama-two', 'shift-handler-nama-three', 'shift-handler-nama-four', 'shift-handler-nama-five']
        const idRole = ['shift-handler-role-one', 'shift-handler-role-two', 'shift-handler-role-three', 'shift-handler-role-four', 'shift-handler-role-five']

        let selectedId = []
        let selectedRole = []
        let shiftLeaderCount = 0
        let payload = []

        if (!jmlBatchPegawai || !shiftHandler || !dateShift) {
            alert("Jumlah Pegawai Shift ini, Shift Pegawai, dan Tanggal Shift tidak boleh kosong")
            return;
        }

        for (let i = 0; i < jmlBatchPegawai; i++){
            let nameTemp = document.getElementById(idNama[i]).value
            let roleTemp = document.getElementById(idRole[i]).value
            const findShiftTeamsId = data_pegawai.find(p => p.nama === nameTemp)
            if (roleTemp === "true") {shiftLeaderCount++}
            let idPegawai = findShiftTeamsId.id_pegawai
            selectedId.push(idPegawai)
            selectedRole.push(roleTemp)

            payload.push({
                tanggal_shift: dateShift,
                shift: shiftHandler,
                pegawai_id: idPegawai,
                shift_leader: roleTemp === "true"
            })
        }
        if(shiftLeaderCount !==1){
            alert('Ketua Shift Maksimal Hanya 1');
            return;
        }
        else if(shiftLeaderCount === 0){
            alert('Pilih Salah Satu Pegawai untuk menjadi ketua shift');
            return;
        }
        let nameCheckers = new Set(selectedId)
        if (nameCheckers.size !== selectedId.length){
            alert("Gagal: Nama Pegawai dalam satu shift tidak boleh ada yang sama!")
            return;
        }

        try{
            isError = false
            for(let data of payload){
                const response = await fetch(`${API_URL}/api/shift_handler`,{
                    method: 'POST',
                    headers: {'Content-Type':'application/json'},
                    body:JSON.stringify(data)
                })
                if(!response.ok){
                    isError = true
                    break;
                }
                if (isError){
                    alert("Gagal Mengirimkan Data")
                }                        
            }
            alert('Tim Shift Berhasil Ditambahkan!');
            state.dataShift = await fetchDataShiftHandler();
            document.getElementById('modal-add-shift-handler').classList.add('hidden');
            showShift()
        }catch (error){
            console.error("Error Sumbiting Shift's Handler", error)
            alert("Terjadi Kesalahan Jaringan.")
        }
    }
}

state.idToDelete = null
state.deleteType = null
async function modalDeleteData(id, type) {
    state.idToDelete = id
    state.deleteType = type
    document.getElementById('modal-delete').classList.remove('hidden');
}

async function executeDelete() {
    if(state.currentPage === 'dashboard'){
        if(!state.idToDelete) {return;}

        try{
            let endpoint = ''
            if(state.deleteType === 'sabr'){
                endpoint=`${API_URL}/api/sabr_report/${state.idToDelete}`
            }
            const response = await fetch(endpoint, {
                method: 'DELETE'
            })

            if (response.ok){
                alert('Laporan Berhasil Dihapus')
                document.getElementById('modal-delete').classList.add('hidden')
                state.dataReport = await fetchDataSabr();
                dashboard()
            }
        }catch (error){
            console.error("Error during deleting", error)
            alert("Terjadi Kesalahan Jaringan.")
        }
    }else if (state.currentPage === 'daftar-shift-handler'){
        if(!state.idToDelete) {return;}
            try{
            let endpoint = ''
            if(state.deleteType === 'shift-team'){
                endpoint=`${API_URL}/api/shift_handler/${state.idToDelete}`
            }
            const response = await fetch(endpoint, {
                method: 'DELETE'
            })
            if (response.ok){
                alert('Data Shift Berhasil Dihapus')
                document.getElementById('modal-delete').classList.add('hidden')
                state.dataShift = await fetchDataShiftHandler();
                showShift()
            }
        }catch (error){
            console.error("Error during deleting", error)
            alert("Terjadi Kesalahan Jaringan.")
        }
    }else if(state.currentPage === 'daftar-pegawai'){
        if(!state.idToDelete) {return;}
        try{
            let endpoint = ''
            if(state.deleteType === 'pegawai'){
                endpoint=`${API_URL}/api/pegawai/${state.idToDelete}`
            }
            const response = await fetch(endpoint, {
                method: 'DELETE'
            })

            if (response.ok){
                alert('Pegawai Berhasil Dihapus')
                document.getElementById('modal-delete').classList.add('hidden')
                state.dataPegawai = await fetchDataPegawai();
                daftarPegawai()
            }
        }catch (error){
            console.error("Error during deleting", error)
            alert("Terjadi Kesalahan Jaringan.")
        }
    }
    else if (state.currentPage === 'daftar-pasien'){
        if(!state.idToDelete) {return;}
        try{
            let endpoint = ''
            if(state.deleteType === 'pasien'){
                endpoint=`${API_URL}/api/pasien/${state.idToDelete}`
            }
            const response = await fetch(endpoint, {
                method: 'DELETE'
            })

            if (response.ok){
                alert('Pasien Berhasil Dihapus')
                document.getElementById('modal-delete').classList.add('hidden')
                state.dataPasien = await fetchDataPasien();
                daftarPasien()
            }
        }catch (error){
            console.error("Error during deleting", error)
            alert("Terjadi Kesalahan Jaringan.")
        }
    }
}