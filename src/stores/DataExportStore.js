import {observable, computed, action} from 'mobx';
import * as Moment from 'moment';


class DataExportStore {
    @observable exportData = null;
    @observable exportType = null;
    @observable exportStatus = null;
    @observable exportRunning = false;
    @observable exportFullData = false;
    t = null;
    csvDelimeter = ',';

    @action async runCsvExport(data, type, status, dbExport) {
        this.exportRunning = true;
        this.exportData = data;
        this.exportType = type;
        this.exportStatus = status;
        this.exportFullData = dbExport;

        let date = Moment().format('YYYYMMDD_HHmm');
        let fileName = dbExport ? `VardaDbExport_${date}.csv` : `VardaExport_${date}.csv`;

        let content = this.csvHeader;
        content += this.csvContent;

        let blob = new Blob(["\uFEFF" + content], {type: 'text/csv; charset=utf-8'});
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
        this.exportFullData = false;

        let date = Moment().format('YYYYMMDD_HHmm');
        let fileName = `VardaExport_${date}.txt`;

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
        let cols = [];

        if (this.exportFullData) {
            cols.push(this.wrap('id'));
            cols.push(this.wrap(this.t('settings.export.fields.title')));
            cols.push(this.wrap(this.t('settings.export.fields.release')));
            cols.push(this.wrap(this.t('settings.export.fields.status')));
            cols.push(this.wrap(this.t('settings.export.fields.timestamp')));
            cols.push(this.wrap(this.t('settings.export.fields.timestamp')));
            cols.push(this.wrap(this.t('settings.export.fields.priority')));
            cols.push(this.wrap(this.t('settings.export.fields.url')));
            cols.push(this.wrap(this.t('settings.export.fields.backdrop')));
        } else {
            cols.push(this.wrap(this.t('settings.export.fields.title')));
            cols.push(this.wrap(this.t('settings.export.fields.release')));
            cols.push(this.wrap(this.t('settings.export.fields.status')));
            cols.push(this.wrap(this.t('settings.export.fields.timestamp')));
            cols.push(this.wrap(this.t('settings.export.fields.timestamp')));
            cols.push(this.wrap(this.t('settings.export.fields.url')));
        }

        return cols.join(this.csvDelimeter);
    }

    @computed get csvContent() {
        let content = '';
        this.exportData.forEach((item) => {
            let cols = [];
            let release = item.release ? Moment(item.release.toDate()) : null;
            let timestamp = item.timestamp ? Moment(item.timestamp.toDate()) : null;
            let url = `https://varda-80e71.firebaseapp.com/browse/${item.mediaType}/${item.id}`

            if (this.exportFullData) {
                cols.push(this.wrap(`${item.mediaType}:${item.id}`));
                cols.push(this.wrap(item.title));
                cols.push(this.wrap(release ? release.format('DD.MM.YYYY') : ''));
                cols.push(this.wrap(item.status));
                cols.push(this.wrap(timestamp ? timestamp.toISOString() : ''));
                cols.push(this.wrap(timestamp ? timestamp.format('DD.MM.YYYY HH:mm') : ''));
                cols.push(this.wrap(item.priority ? item.priority : ''));
                cols.push(this.wrap(url));
                cols.push(this.wrap(item.backdrop));
            } else {
                cols.push(this.wrap(item.title));
                cols.push(this.wrap(release ? release.format('DD.MM.YYYY') : ''));
                cols.push(this.wrap(this.t(`common.status.${item.status}`)));
                cols.push(this.wrap(timestamp ? timestamp.format('DD.MM.YYYY') : ''));
                cols.push(this.wrap(timestamp ? timestamp.toISOString() : ''));
                cols.push(this.wrap(url));
            }

            content += `\n${cols.join(this.csvDelimeter)}`;
        })
        return content;
    }

    @computed get textHeader() {
        let date = Moment().format('DD.MM.YYYY HH:mm');
        let type = this.exportType;
        let status = this.exportStatus;
        let header = `${this.t('settings.export.fileHeader').toUpperCase()} ${date}`;
        header += `\n${this.t('common.mediaType.label')}: ${this.t(`common.mediaType.${type}`)}`;
        header += `\n${this.t('common.status.label')}: ${this.t(`common.status.${status}`)}`;
        header += `\n${this.t('common.count')}: ${this.exportData.size}`;
        header += '\n\n'
        console.log(header, type, status);
        return header
    }

    @computed get textContent() {
        let content = '';
        this.exportData.forEach((item) => {
            let releaseDate = item.release ? Moment(item.release.toDate()) : null;
            const releaseDateString = releaseDate ? releaseDate.format('YYYY') : '-';
            content += `${item.title} (${releaseDateString})\n`;
        })
        return content;
    }

    wrap(text) {
        return `"${text}"`;
    }
}

// ensure single instance
const store = new DataExportStore();
export default store;