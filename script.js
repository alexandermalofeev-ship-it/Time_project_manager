import { putData, getData } from "./jsbox.js";

const addProjectBtn = document.querySelector('#add-project');
const appEl = document.querySelector('.app');

addProjectBtn.addEventListener('click', () => {
    appEl.append(new Project().getCard());
});

class Project {
    #id = null;
    #title = 'Без названия';
    #beginDate = null;
    #finalDate = null;
    #progressbarLenght = 0;
    #remainDays = 0;
    #totalTime = 0;
    #totalMoney = 0;
    #daylySalary = 5000;
    taskCounter = 0;
    // taskArray = [];

    constructor(id, title, begin, final, totaltime, daysalary, tasks, taskCounter) {
        this.#id = id || this.getId();
        this.title = title || 'Б/н';
        this.beginDate = begin;
        this.finalDate = final;
        this.#totalTime = totaltime || 0;
        this.#daylySalary = daysalary || 5000;
        this.beginDateFormat = new Date(this.beginDate);
        this.finalDateFormat = new Date(this.finalDate);
        this.duration = (this.finalDateFormat - this.beginDateFormat) / 60 / 60 / 24 / 1000;
        this.taskArray = tasks || [];
        this.taskCounter = taskCounter || 0;
        console.log(this.taskArray);

    }




    getId() {
        if (this.#id === null) {
            const id = Math.floor(Math.random() * 1000);
            return id;
        }
        return;

    }

    getCard() {

        this.cardEl = document.createElement('div');
        this.cardEl.classList.add('card');

        //левый контейнер карточки
        this.wrapperLeft = document.createElement('div');
        this.wrapperLeft.classList.add('wrapper');

        const daySalaryEl = document.createElement('p');
        daySalaryEl.classList.add('daySalary');
        daySalaryEl.textContent = `Дневная ставка: ${this.#daylySalary}`;

        const btnSaveProject = document.createElement('button');
        btnSaveProject.classList.add('btn');
        btnSaveProject.textContent = 'СОХРАНИТЬ';
        btnSaveProject.addEventListener('click', () => {
            this.updateStorage();
        });

        daySalaryEl.addEventListener('click', () => {
            const modal = this.getModalWindow();
            modal.innerHTML = `
                <form class="form">                       
                        <input type="text" class="text-field" id="title"/>                                   
                        <button class="btn" type="submit">Сохранить</button>
                </form>`;

            document.body.append(modal);

            const formEl = modal.querySelector('.form');
            const inputEl = modal.querySelector('#title');
            inputEl.value = this.#daylySalary;

            formEl.addEventListener('submit', (event) => {
                event.preventDefault();
                this.#daylySalary = +inputEl.value;
                daySalaryEl.textContent = `Дневная ставка: ${this.#daylySalary}`;
                this.estimateSalary = this.duration * this.#daylySalary;
                this.estimateSalaryEl.textContent = `Предполагаемая ЗП: ${this.estimateSalary} руб.`;
                modal.remove();
                this.totalMoneyEl.textContent = `Заработано: ${Math.round(this.#totalTime / 60 / 60 / 8 * this.#daylySalary)} р.`;
            });

        });

        const wrapperTitleEl = document.createElement('div');
        wrapperTitleEl.classList.add('wrapper-btn');
        //титул
        this.titleEl = document.createElement('p');
        this.titleEl.classList.add('title');
        this.titleEl.textContent = this.#title;

        this.titleEl.addEventListener('click', () => {
            this.getDescriptionAndDate();
        });

        const btnDelProject = document.createElement('button');
        btnDelProject.classList.add('btn');
        btnDelProject.textContent = 'Удалить';
        btnDelProject.addEventListener('click', () => {
            const storageArray = JSON.parse(localStorage.getItem('project'));
            for (let index = 0; index < storageArray.length; index++) {
                const el = storageArray[index];
                if (this.#id === el.id) {
                    storageArray.splice(index, 1);
                }
            }
            // localStorage.setItem('project', JSON.stringify(storageArray));
            putData(storageArray);

            this.cardEl.remove();
        });

        wrapperTitleEl.append(this.titleEl, btnDelProject);
        // дата начала
        this.beginDateEl = document.createElement('p');
        this.beginDateEl.classList.add('paragraph');
        this.beginDateEl.textContent = `Начало: ${this.beginDateFormat.toLocaleDateString("en-GB")} `;
        //дата конца
        this.finalDateEl = document.createElement('p');
        this.finalDateEl.classList.add('paragraph');
        this.finalDateEl.textContent = `Конец: ${this.finalDateFormat.toLocaleDateString("en-GB")}`;
        //дней
        this.durationEl = document.createElement('p');
        this.durationEl.classList.add('paragraph');
        this.durationEl.textContent = `Количество дней: ${this.duration} дн.`;
        //предполагаемая ЗП
        this.estimateSalaryEl = document.createElement('p');
        this.estimateSalaryEl.classList.add('paragraph');
        this.estimateSalaryEl.textContent = `Предполагаемая ЗП: ${this.duration * this.#daylySalary} руб.`;
        //прогрессбар
        this.progressbar = this.getProgressBar();
        //кнопки старт-стоп
        this.timeControls = this.getWorkingTimeButtons();
        //затраченное время
        this.totalTimeEl = this.getParagraph(`Общее затраченное время: ${Math.trunc(this.#totalTime / 60 / 60)}ч.${Math.trunc(this.#totalTime / 60 % 60)} мин.`);
        this.totalTimeEl.classList.add('daySalary');

        this.totalTimeEl.addEventListener('click', () => {
            const modal = this.getModalWindow();
            modal.innerHTML = `
                <form class="form">                       
                        <input type="text" class="text-field" id="title"/>                                   
                        <button class="btn" type="submit">Сохранить</button>
                </form>`;

            document.body.append(modal);

            const formEl = modal.querySelector('.form');
            const inputEl = modal.querySelector('#title');
            inputEl.value = this.#totalTime / 3600;

            formEl.addEventListener('submit', (event) => {
                event.preventDefault();
                this.#totalTime = +inputEl.value * 3600;
                this.totalTimeEl.textContent = `Общее затраченное время: ${Math.trunc(this.#totalTime / 60 / 60)}ч.${Math.trunc(this.#totalTime / 60 % 60)} мин.`;

                this.totalMoneyEl.textContent = `Заработано: ${Math.round(this.#totalTime / 60 / 60 / 8 * this.#daylySalary)} р.`;
                modal.remove();
            });

        });


        //всего заработано
        this.totalMoneyEl = this.getParagraph(`Заработано: ${Math.round(this.#totalTime / 60 / 60 / 8 * this.#daylySalary)} р.`);

        this.wrapperLeft.append(daySalaryEl, btnSaveProject, wrapperTitleEl, this.beginDateEl, this.finalDateEl, this.durationEl, this.estimateSalaryEl, this.timeControls, this.progressbar, this.totalTimeEl, this.totalMoneyEl);

        //правый контейнер карточки
        this.wrapperRight = document.createElement('div');
        this.wrapperRight.classList.add('wrapper');
        //кнопка добавить задачу
        const buttAddTask = document.createElement('button');
        buttAddTask.classList.add('btn');
        buttAddTask.textContent = '+ Добавить задачу';
        buttAddTask.addEventListener('click', () => {
            this.wrapperCurrentTask.append(this.getTask(this.taskCounter, 'Название задачи', 'Описание задачи', false));
        });


        //контейнер невыполненные задачи

        this.wrapperCurrentTask = document.createElement('div');
        this.wrapperCurrentTask.classList.add('wrapper__task');

        //контейнер выполненные задачи
        this.wrapperDoneTask = document.createElement('div');
        this.wrapperDoneTask.classList.add('wrapper__task');
        ;

        //рендер правый враппер
        this.wrapperRight.append(buttAddTask, this.wrapperCurrentTask, this.wrapperDoneTask);


        // this.wrapperRight.append(this.totalTimeEl);

        //рендер правый и левый враппер
        this.cardEl.append(this.wrapperLeft, this.wrapperRight);
        this.renderTask();

        return this.cardEl;
    }

    getParagraph(text) {
        const el = document.createElement('p');
        el.classList.add('paragraph');
        el.textContent = `${text}`;
        return el;
    }


    getModalWindow() {
        const modaWindowEl = document.createElement('div');
        modaWindowEl.classList.add('modal-window');
        return modaWindowEl;
    }


    getDescriptionAndDate() {
        const modalEl = this.getModalWindow();
        modalEl.innerHTML = `
        <form class="form">
            <label>Название:
            <input type="text" class="text-field" id="title"/></label>
            <label>Дата начала:
            <input type="date" class="text-field" id="begin-date" required/></label>
            <label>Дата окончания:
            <input type="date" class="text-field" id="final-date" required/></label>            
            <button class="btn" type="submit">Сохранить</button>
        </form>`;


        document.body.append(modalEl);

        const formTitleEl = modalEl.querySelector('#title');
        const formBeginDateEl = modalEl.querySelector('#begin-date');
        const formFinalDateEl = modalEl.querySelector('#final-date');
        const formEl = document.querySelector('.form');

        const warningEl = document.createElement('p');
        warningEl.textContent = 'Начальная дата > конечной';
        warningEl.style.color = 'red';


        formTitleEl.value = this.#title;
        if (this.#beginDate) {
            const beginDate = new Date(this.#beginDate);
            formBeginDateEl.value = beginDate.toISOString().split('T')[0];
        }
        if (this.#finalDate) {
            const finalDate = new Date(this.#finalDate);
            formFinalDateEl.value = finalDate.toISOString().split('T')[0];
        }

        formEl.addEventListener('submit', (event) => {
            event.preventDefault();

            this.title = formTitleEl.value;
            this.beginDate = new Date(formBeginDateEl.value);
            this.finalDate = new Date(formFinalDateEl.value);

            this.duration = (this.finalDate - this.beginDate) / 60 / 60 / 24 / 1000;

            this.durationEl.textContent = `Количество дней: ${this.duration} дн.`;
            this.estimateSalary = this.duration * this.#daylySalary;
            this.estimateSalaryEl.textContent = `Предполагаемая ЗП: ${this.estimateSalary}руб.`;
            this.progressLineEl.style.width = `${this.getProgressBarLenght() * 200}px`;
            this.boundaryEl.textContent = `Осталось ${this.getRemainDays()} дн.`;

            if (!this.wrapperLeft.contains(this.progressbar)) {
                this.wrapperLeft.append(this.progressbar);
            }

            if (this.beginDate > this.finalDate) {

                if (!formEl.contains(warningEl)) {
                    formEl.append(warningEl);
                    return;
                }
                return;

            }

            modalEl.remove();
        });
    };
    set title(value) {
        this.#title = value;
        if (this.titleEl) {
            this.titleEl.textContent = this.#title;
        }
    }
    get title() {
        return this.#title;
    }

    set beginDate(value) {
        this.#beginDate = value;

        if (this.beginDateEl) {
            this.beginDateEl.textContent = `Начало: ${this.#beginDate.toLocaleDateString("en-GB")}`;
        }
    }
    get beginDate() {
        return this.#beginDate;
    }

    set finalDate(value) {
        this.#finalDate = value;
        if (this.finalDateEl) {
            this.finalDateEl.textContent = `Конец: ${this.#finalDate.toLocaleDateString("en-GB")}`;
        }
        if (!this.beginDate) { return; }

    }
    get finalDate() {
        return this.#finalDate;
    }


    getProgressBar() {
        const progressBarEl = document.createElement('div');
        progressBarEl.classList.add('progressbar');

        this.boundaryEl = document.createElement('div');
        this.boundaryEl.classList.add('progressbar-boundary');
        this.boundaryEl.textContent = `Осталось ${this.getRemainDays()} дн.`;

        this.progressLineEl = document.createElement('div');
        this.progressLineEl.classList.add('progressbar-line');
        this.progressLineEl.style.width = `${this.getProgressBarLenght() * 200}px`;

        progressBarEl.append(this.progressLineEl, this.boundaryEl);

        return progressBarEl;
    }

    getProgressBarLenght() {
        let length = 0;
        this.progressLineEl.style.backgroundColor = null;
        const currDate = new Date();
        length = (currDate - this.beginDateFormat) / 60 / 60 / 24 / 1000 / this.duration;

        if (length > 1) {
            length = 1;
            this.progressLineEl.style.backgroundColor = 'red';
        }
        if (length < 0) {
            length = 0;
        }

        return length;
    }

    getRemainDays() {
        const currDate = new Date();
        this.finalDateFormat = new Date(this.finalDate);
        const remainDays = Math.round((this.finalDateFormat - currDate) / 60 / 60 / 24 / 1000);
        // console.log(remainDays);
        return remainDays;
    }


    async updateStorage() {
        // const storageArray = JSON.parse(localStorage.getItem('project')) || [];
        const storageArray = await getData() || [];

        console.log(storageArray);
        let flag = true;

        const projectVariables = {
            id: this.#id,
            title: this.#title,
            beginDate: this.#beginDate,
            finalDate: this.#finalDate,
            totalTime: this.#totalTime,
            daylySalary: this.#daylySalary,
            tasks: this.taskArray,
            taskCounter: this.taskCounter,
        };


        for (let index = 0; index < storageArray.length; index++) {
            const el = storageArray[index];
            if (el.id === this.#id) {
                console.log('заменяем');
                storageArray.splice(index, 1, projectVariables);
                // localStorage.setItem('project', JSON.stringify(storageArray));
                putData(storageArray);
                flag = false;
            }

        }

        if (flag === true) {
            storageArray.push(projectVariables);
            console.log('пушим', storageArray);
            // localStorage.setItem('project', JSON.stringify(storageArray));
            await putData(storageArray);
        }

    }


    getWorkingTimeButtons() {
        const timeControls = document.createElement('div');
        timeControls.innerHTML = `
            <div class="wrapper-btn">
                <div class="wrapper-btn">
                    <button class="btn" id="start-button" data-index='start'>Старт</button>
                </div>
                <div class="wrapper-btn" id="time-table">0</div>
                <div class="wrapper-btn">
                    <button class="btn" id="stop-button" data-index='stop'>Стоп</button>
                </div>
            </div>`;

        const timeTable = timeControls.querySelector('#time-table');
        const startBtn = timeControls.querySelector('#start-button');
        const stopBtn = timeControls.querySelector('#stop-button');
        let startTime;

        startBtn.addEventListener('click', () => {

            if (!startBtn.classList.contains('active')) {
                startBtn.classList.add('active');
                startTime = new Date();
                console.log(startTime);
                timeTable.textContent = '0';
                startBtn.textContent = `${startTime.getHours()} : ${startTime.getMinutes() < 10 ? '0' + startTime.getMinutes() : startTime.getMinutes()}`;
                stopBtn.textContent = 'Стоп';
            }
            stopBtn.classList.remove('active');

        });
        stopBtn.addEventListener('click', () => {

            if (!stopBtn.classList.contains('active')) {
                stopBtn.classList.add('active');
                const endTime = new Date;
                const durationSession = (endTime - startTime) / 1000;
                this.#totalTime += durationSession;
                this.totalTimeEl.textContent = `Общее затраченное время: ${Math.floor(this.#totalTime / 60 / 60)}ч. ${Math.floor(this.#totalTime / 60 % 60)} мин.`;
                this.#totalMoney = Math.round(this.#totalTime / 60 / 60 / 8 * this.#daylySalary);
                this.totalMoneyEl.textContent = `Заработано: ${this.#totalMoney} р.`;
                console.log(durationSession);
                timeTable.textContent = `${Math.trunc(durationSession / 3600)} ч. ${Math.trunc(durationSession / 60 % 60)} мин.`;
                stopBtn.textContent = `${endTime.getHours()} : ${endTime.getMinutes() < 10 ? '0' + endTime.getMinutes() : endTime.getMinutes()}`;
                startBtn.textContent = 'Старт';
                this.updateStorage();

            }
            startBtn.classList.remove('active');

        });

        return timeControls;
    }


    async renderTask() {
        // const storageArray = JSON.parse(localStorage.getItem('project')) || [];
        const storageArray = await getData() || [];


        storageArray.forEach(element => {

            if (this.#id === element.id) {
                element.tasks.forEach(el => {
                    // console.log(el.taskId, el.taskName, el.taskDescription, el.taskDone);
                    const taskEl = this.getTask(el.Id, el.taskName, el.taskDescription, el.taskDone);
                    if (!el.taskDone) {
                        this.wrapperCurrentTask.append(taskEl);
                    } else {
                        this.wrapperDoneTask.append(taskEl);
                    }

                });
            }
        });

    }





    getTask(id, name, description, status) {
        const currTask = {};
        currTask.Id = id;
        currTask.taskName = name;
        currTask.taskDescription = description;
        currTask.taskDone = status;
        const taskEl = document.createElement('div');
        taskEl.classList.add('task');
        taskEl.innerHTML = `
        <div class='task__card'>
         <div class='wrapper__task'>
            <div id="task__title" data-name='taskName' class='paragraph'>${name}</div>
             </div>
             <div class='wrapper__task'>
            <div id="task__description" data-name='taskDescription' class='paragraph'>${description}</div>
             </div>            
        
             <div class='wrapper__task'>
             ${!status ? `<button id="task-done" class='btn'>Выполнено</button>` : ''}
            <button id="task-delete" class ='btn'>Удалить</button>
             </div>
            
        </div>`;

        if (status) {
            taskEl.style.backgroundColor = 'lightgreen';
        }


        const changingEl = taskEl.querySelectorAll('.paragraph');
        changingEl.forEach(element => {
            element.addEventListener('click', (e) => {
                const el = e.target;
                const modal = this.getModalWindow();
                modal.innerHTML = `
                <form class="form">                       
                        <input type="text" class="text-field" id="title"/>                                   
                        <button class="btn" type="submit">Сохранить</button>
                </form>`;

                document.body.append(modal);

                const formEl = modal.querySelector('.form');
                const inputEl = modal.querySelector('#title');
                inputEl.value = el.textContent;

                formEl.addEventListener('submit', (event) => {
                    event.preventDefault();

                    el.textContent = inputEl.value;
                    currTask[el.dataset.name] = inputEl.value;
                    this.taskUpdate(currTask);
                    console.log(currTask);
                    console.log(this.taskArray);

                    modal.remove();
                });

            });
        });

        const btnDone = taskEl.querySelector('#task-done');
        if (btnDone) {
            btnDone.addEventListener('click', () => {
                currTask.taskDone = true;
                console.log(currTask);

                if (taskEl.parentNode) {
                    const doneTaskEl = taskEl.parentNode.removeChild(taskEl);
                    doneTaskEl.style.backgroundColor = 'lightgreen';
                    btnDone.remove();
                    this.wrapperDoneTask.append(doneTaskEl);
                }
            });
        }

        const btnDel = taskEl.querySelector('#task-delete');
        btnDel.addEventListener('click', () => {
            this.taskRemove(currTask);
            taskEl.remove();
            console.log('удаляем таск', currTask);
        });
        this.taskCounter++;



        return taskEl;
    }

    taskUpdate(task) {
        // console.log('ID>>> ' + task.Id);

        let flag = true;
        for (let index = 0; index < this.taskArray.length; index++) {
            const element = this.taskArray[index];
            if (element.Id === task.Id) {
                console.log('заменяем таск');
                this.taskArray.splice(index, 1, task);
                flag = false;
            }
        }
        if (flag === true) {
            console.log('пушим таск');
            this.taskArray.push(task);
        }
    };
    taskRemove(task) {
        for (let index = 0; index < this.taskArray.length; index++) {
            const element = this.taskArray[index];
            if (element.Id === task.Id) {
                console.log('удаляем таск', task);
                this.taskArray.splice(index, 1);
            }
        }
    }

};



window.onload = () => {
    const projects = JSON.parse(localStorage.getItem('project'));

    if (projects) {
        projects.forEach(project => {
            const el = new Project(project.id, project.title, project.beginDate, project.finalDate, project.totalTime, project.daylySalary, project.tasks, project.taskCounter);
            appEl.append(el.getCard());

        });
    };
};


//constructor(title, begin, final, totaltime, daysalary)


// const project1 = new Project('Проект №1');
// appEl.append(project1.getCard());

// project1.getThis();
// project1.putToJSON()
// project1.getFromJSON()
// project1.getProgressBar()
// project1.finalDate.toISOString().split('T')[0]

// project1.#beginDate;



