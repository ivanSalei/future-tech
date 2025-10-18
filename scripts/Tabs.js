// Основний селектор кореневого елемента табів (вкладок)
const rootSelector = '[data-js-tabs]'

class Tabs {
    // Зберігаємо всі внутрішні селектори для кнопок і контенту
    selectors = {
        root: rootSelector,
        button: '[data-js-tabs-button]',      // селектор кнопок вкладок
        content: '[data-js-tabs-content]',    // селектор блоків контенту вкладок
    }

    // Класи, що відповідають за активний стан
    stateClasses = {
        isActive: 'is-active',                // клас активної кнопки або контенту
    }

    // Атрибути стану (для доступності ARIA)
    stateAttributes = {
        ariaSelected: 'aria-selected',
        tabIndex: 'tabindex',
    }

    // Конструктор — викликається при створенні нового об’єкта Tabs
    constructor(rootElement) {
        this.rootElement = rootElement                                          // головний елемент
        this.buttonElements = this.rootElement.querySelectorAll(this.selectors.button)   // усі кнопки вкладок
        this.contentElements = this.rootElement.querySelectorAll(this.selectors.content) // усі блоки контенту

        // Знаходимо, яка вкладка активна за замовчуванням (має клас .is-active)
        this.state = {
            activeTabIndex: [...this.buttonElements]
                .findIndex((buttonElement) =>
                    buttonElement.classList.contains(this.stateClasses.isActive)
                )
        }

        // Якщо активної вкладки немає — встановлюємо першу
        if (this.state.activeTabIndex === -1) {
            this.state.activeTabIndex = 0
        }

        // Межа кількості вкладок (останній індекс)
        this.limitTabsIndex = this.buttonElements.length - 1

        // Прив’язуємо події
        this.bindEvents()

        // Оновлюємо інтерфейс
        this.updateUI()
    }

    // Метод для оновлення інтерфейсу після зміни активної вкладки
    updateUI() {
        const { activeTabIndex } = this.state

        // Оновлюємо стан кнопок
        this.buttonElements.forEach((buttonElement, index) => {
            const isActive = index === activeTabIndex
            buttonElement.classList.toggle(this.stateClasses.isActive, isActive)
            buttonElement.setAttribute(this.stateAttributes.ariaSelected, isActive.toString())
            buttonElement.setAttribute(this.stateAttributes.tabIndex, isActive ? '0' : '-1')
        })

        // Оновлюємо стан контенту
        this.contentElements.forEach((contentElement, index) => {
            const isActive = index === activeTabIndex
            contentElement.classList.toggle(this.stateClasses.isActive, isActive)
        })
    }

    // Активує вкладку за індексом
    activateTab(newTabIndex) {
        this.state.activeTabIndex = newTabIndex
        this.updateUI()
        this.buttonElements[newTabIndex].focus()
    }

    // Перехід до попередньої вкладки
    previousTab = () => {
        const newTabIndex =
            this.state.activeTabIndex === 0
                ? this.limitTabsIndex
                : this.state.activeTabIndex - 1

        this.activateTab(newTabIndex)
    }

    // Перехід до наступної вкладки
    nextTab = () => {
        const newTabIndex =
            this.state.activeTabIndex === this.limitTabsIndex
                ? 0
                : this.state.activeTabIndex + 1

        this.activateTab(newTabIndex)
    }

    // Перехід до першої вкладки
    firstTab = () => {
        this.activateTab(0)
    }

    // Перехід до останньої вкладки
    lastTab = () => {
        this.activateTab(this.limitTabsIndex)
    }

    // Метод, який викликається при кліку на кнопку вкладки
    onButtonClick(buttonIndex) {
        this.state.activeTabIndex = buttonIndex
        this.updateUI()
    }

    // Обробка натискань клавіш (для доступності)
    onKeyDown = (event) => {
        const { code, metaKey } = event

        // Об’єкт із діями для різних клавіш
        const actions = {
            ArrowLeft: this.previousTab,
            ArrowRight: this.nextTab,
            Home: this.firstTab,
            End: this.lastTab,
        }

        // Підтримка Mac-комбінацій (Cmd + ← / →)
        const isMacHomeKey = metaKey && code === 'ArrowLeft'
        const isMacEndKey = metaKey && code === 'ArrowRight'

        if (isMacHomeKey) {
            this.firstTab()
            return
        }

        if (isMacEndKey) {
            this.lastTab()
            return
        }

        // Виконуємо дію, якщо клавіша є в об’єкті actions
        actions[code]?.()
    }

    // Прив’язуємо події до елементів
    bindEvents() {
        this.buttonElements.forEach((buttonElement, index) => {
            // Клік мишкою
            buttonElement.addEventListener('click', () => this.onButtonClick(index))
        })

        // Клавіатурна навігація
        this.rootElement.addEventListener('keydown', this.onKeyDown)
    }
}

// Клас-колекція, який ініціалізує всі таби на сторінці
class TabsCollection {
    constructor() {
        this.init() // Запускаємо ініціалізацію при створенні об’єкта
    }

    // Знаходимо всі елементи з атрибутом [data-js-tabs]
    // і створюємо для кожного окремий об’єкт Tabs
    init() {
        document.querySelectorAll(rootSelector).forEach((element) => {
            new Tabs(element)
        })
    }
}

// Експортуємо клас, щоб його можна було імпортувати через import
export default TabsCollection
