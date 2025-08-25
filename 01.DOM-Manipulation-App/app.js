window.addEventListener("load", solve);

function solve() {
    
    const nameInput = document.getElementById('customer-name');
    const baseInput = document.getElementById('base-choice');
    const fruitInput = document.getElementById('fruit-choice');
    const sweetenerInput = document.getElementById('sweetener-amount');

    
    const customizeBtn = document.getElementById('order-btn');
    const editBtn = document.getElementById('edit-btn');
    const confirmBtn = document.getElementById('confirm-btn');
    const backBtn = document.getElementById('back-btn');

    
    const previewSection = document.getElementById('order-preview');
    const successSection = document.getElementById('order-success');

    
    const previewName = document.getElementById('preview-name');
    const previewBase = document.getElementById('preview-base');
    const previewFruit = document.getElementById('preview-fruit');
    const previewSweetener = document.getElementById('preview-sweetener');

    let currentOrder = {}; 

    customizeBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        const base = baseInput.value;
        const fruit = fruitInput.value;
        const sweetener = sweetenerInput.value.trim();

        
        if (!name || !base || !fruit || !sweetener) {
            return; 
        }

        
        currentOrder = { name, base, fruit, sweetener };

        
        previewName.textContent = name;
        previewBase.textContent = base;
        previewFruit.textContent = fruit;
        previewSweetener.textContent = sweetener;

       
        previewSection.style.display = 'block';

        
        customizeBtn.disabled = true;

        
        nameInput.value = '';
        baseInput.selectedIndex = 0;
        fruitInput.selectedIndex = 0;
        sweetenerInput.value = '';
    });

    
    editBtn.addEventListener('click', () => {
        
        nameInput.value = currentOrder.name;
        baseInput.value = currentOrder.base;
        fruitInput.value = currentOrder.fruit;
        sweetenerInput.value = currentOrder.sweetener;

        
        previewSection.style.display = 'none';

        
        customizeBtn.disabled = false;
    });

    
    confirmBtn.addEventListener('click', () => {
        previewSection.style.display = 'none';
        successSection.style.display = 'block';
    });

    
    backBtn.addEventListener('click', () => {
        successSection.style.display = 'none';
        customizeBtn.disabled = false;
    });
}
