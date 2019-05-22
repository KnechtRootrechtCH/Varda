import {observable, computed, action} from 'mobx';
import * as Moment from 'moment';


class DataExportStore {
    @observable exportData = null;
    @observable exportType = null;
    @observable exportStatus = null;
    @observable exportRunning = false;
    t = null;

    @action async runCsvExport(data, type, status) {
        this.exportRunning = true;
        this.exportData = data;
        this.exportType = type;
        this.exportStatus = status;

        let date = Moment().format('YYYYMMDD_HHmm');
        let fileName = `export_${date}.csv`;

        let content = this.textHeader;
        content += this.textContent;

        let blob = new Blob([content], {type: 'text/plain;charset=utf-8'});
        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, fileName);
        } else {
            let elem = window.document.createElement('a');
            elem.href = window.URL.createObjectURL(blob);
            elem.download = fileName;
            document.body.appendChild(elem);
            elem.click();
            document.body.removeChild(elem);
        }
    }

    @action async runTxtExport(data, type, status) {
        this.exportRunning = true;
        this.exportData = data;
        this.exportType = type;
        this.exportStatus = status;

        let date = Moment().format('YYYYMMDD_HHmm');
        let fileName = `export_${date}.txt`;

        let content = this.textHeader;
        content += this.textContent;

        let blob = new Blob([content], {type: 'text/plain;charset=utf-8'});
        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, fileName);
        } else {
            let elem = window.document.createElement('a');
            elem.href = window.URL.createObjectURL(blob);
            elem.download = fileName;
            document.body.appendChild(elem);
            elem.click();
            document.body.removeChild(elem);
        }
    }

    @action registerI18nFunction(t) {
        this.t = t;
    }

    @computed get csvHeader() {
        return '';
    }

    @computed get csvContent() {
        this.exportData.forEach((item) => {
            console.debug('item', item);
            // backdrop, id, mediaType, priority, release, status, timestamp, title
        })
        return '';
    }

    @computed get textHeader() {
        let date = Moment().format('DD.MM.YYYY HH:mm');
        let type = this.exportType;
        let status = this.exportStatus;
        let header = `${this.t('settings.export.fileHeader').toUpperCase()} ${date}`;
        header += `\n${this.t('settings.export.type')}: ${this.t(`list.filter.mediaType.${type}`)}`;
        header += `\n${this.t(`list.filter.status.${status}`)}`;
        header += `\n${this.t('common.count')}: ${this.exportData.size}`;
        header += '\n\n'
        console.log(header, type, status);
        return header
    }

    @computed get textContent() {
        let data = '';
        this.exportData.forEach((item) => {
            let releaseDate = item.release ? Moment(item.release.toDate()) : null;
            const releaseDateString = releaseDate ? releaseDate.format('YYYY') : '-';
            data += `${item.title} (${releaseDateString})\n`;
        })
        return data;
    }
}

// ensure single instance
const store = new DataExportStore();
export default store;