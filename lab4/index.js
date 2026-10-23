// ============================================================
// ШАГ 1 и 2: Реализация через КЛАССЫ (class)
// ============================================================
 
/**
 * Класс, представляющий предмет в инвентаре.
 */
class Item {
  /**
   * Создаёт новый предмет.
   * @param {string} name - Название предмета.
   * @param {number} weight - Вес предмета (в кг).
   * @param {string} rarity - Редкость: 'common', 'uncommon', 'rare', 'legendary'.
   */
  constructor(name, weight, rarity) {
    this.name = name;
    this.weight = weight;
    this.rarity = rarity;
  }
 
  /**
   * Возвращает строку с информацией о предмете.
   * @returns {string} Описание предмета.
   */
  getInfo() {
    return `[${this.rarity.toUpperCase()}] ${this.name} | Вес: ${this.weight} кг`;
  }
 
  /**
   * Изменяет вес предмета.
   * @param {number} newWeight - Новый вес предмета (в кг).
   */
  setWeight(newWeight) {
    this.weight = newWeight;
    console.log(`Вес "${this.name}" изменён на ${newWeight} кг.`);
  }
}
 
/**
 * Класс оружия, расширяет Item.
 * Добавляет урон и прочность.
 * @extends Item
 */
class Weapon extends Item {
  /**
   * Создаёт новое оружие.
   * @param {string} name - Название оружия.
   * @param {number} weight - Вес оружия (в кг).
   * @param {string} rarity - Редкость оружия.
   * @param {number} damage - Урон оружия.
   * @param {number} durability - Прочность оружия (0–100).
   */
  constructor(name, weight, rarity, damage, durability) {
    super(name, weight, rarity);
    this.damage = damage;
    this.durability = durability;
  }
 
  /**
   * Возвращает строку с информацией об оружии (включает урон и прочность).
   * @returns {string} Описание оружия.
   */
  getInfo() {
    return `${super.getInfo()} | Урон: ${this.damage} | Прочность: ${this.durability}/100`;
  }
 
  /**
   * Использует оружие — уменьшает прочность на 10.
   * Если прочность уже 0, выводит предупреждение.
   */
  use() {
    if (this.durability > 0) {
      this.durability = Math.max(0, this.durability - 10);
      console.log(`"${this.name}" использовано. Прочность: ${this.durability}/100`);
    } else {
      console.log(`"${this.name}" сломано и не может быть использовано!`);
    }
  }
 
  /**
   * Восстанавливает прочность оружия до 100.
   */
  repair() {
    this.durability = 100;
    console.log(`"${this.name}" починено. Прочность восстановлена до 100.`);
  }
}
 
// ============================================================
// ШАГ 3: Тестирование классов
// ============================================================
 
console.log("======= ТЕСТ КЛАССОВ =======\n");
 
const sword = new Item("Steel Sword", 3.5, "rare");
console.log(sword.getInfo());
sword.setWeight(4.0);
console.log(sword.getInfo());
 
console.log();
 
const bow = new Weapon("Longbow", 2.0, "uncommon", 15, 100);
console.log(bow.getInfo());
bow.use();
console.log("Прочность после использования:", bow.durability); // 90
bow.repair();
console.log("Прочность после ремонта:", bow.durability); // 100
 
console.log();
 
// Доводим прочность до 0 и пробуем использовать сломанное оружие
const axe = new Weapon("Iron Axe", 5.0, "common", 20, 10);
console.log(axe.getInfo());
axe.use(); // durability: 0
axe.use(); // уже сломано
 
// ============================================================
// ШАГ 4а: Опциональная цепочка (?.)
// ============================================================
 
console.log("\n======= ОПЦИОНАЛЬНАЯ ЦЕПОЧКА =======\n");
 
const items = [
  new Item("Health Potion", 0.3, "common"),
  null,
  new Weapon("Legendary Staff", 1.5, "legendary", 80, 100),
  undefined,
];
 
// Без ?. здесь был бы TypeError для null/undefined
items.forEach((item, index) => {
  const info = item?.getInfo();
  console.log(`items[${index}]: ${info ?? "предмет отсутствует (null/undefined)"}`);
});
 
// Обращение к вложенному свойству несуществующего объекта
const emptySlot = null;
console.log("\nДоступ к свойству null через ?.:");
console.log("emptySlot?.name →", emptySlot?.name); // undefined, без ошибки
 
// ============================================================
// ШАГ 4б: Функции-конструкторы (альтернатива классам)
// ============================================================
 
console.log("\n======= ФУНКЦИИ-КОНСТРУКТОРЫ =======\n");
 
/**
 * Функция-конструктор для создания предмета инвентаря.
 * @constructor
 * @param {string} name - Название предмета.
 * @param {number} weight - Вес предмета (в кг).
 * @param {string} rarity - Редкость предмета.
 */
function ItemConstructor(name, weight, rarity) {
  this.name = name;
  this.weight = weight;
  this.rarity = rarity;
}
 
/**
 * Возвращает строку с информацией о предмете.
 * @returns {string} Описание предмета.
 */
ItemConstructor.prototype.getInfo = function () {
  return `[${this.rarity.toUpperCase()}] ${this.name} | Вес: ${this.weight} кг`;
};
 
/**
 * Изменяет вес предмета.
 * @param {number} newWeight - Новый вес (в кг).
 */
ItemConstructor.prototype.setWeight = function (newWeight) {
  this.weight = newWeight;
  console.log(`Вес "${this.name}" изменён на ${newWeight} кг.`);
};
 
/**
 * Функция-конструктор для создания оружия.
 * Наследует от ItemConstructor.
 * @constructor
 * @param {string} name - Название оружия.
 * @param {number} weight - Вес оружия.
 * @param {string} rarity - Редкость.
 * @param {number} damage - Урон.
 * @param {number} durability - Прочность (0–100).
 */
function WeaponConstructor(name, weight, rarity, damage, durability) {
  // Вызываем конструктор родителя
  ItemConstructor.call(this, name, weight, rarity);
  this.damage = damage;
  this.durability = durability;
}
 
// Настраиваем цепочку прототипов (наследование)
WeaponConstructor.prototype = Object.create(ItemConstructor.prototype);
WeaponConstructor.prototype.constructor = WeaponConstructor;
 
/**
 * Возвращает информацию об оружии.
 * @returns {string} Описание оружия.
 */
WeaponConstructor.prototype.getInfo = function () {
  return `${ItemConstructor.prototype.getInfo.call(this)} | Урон: ${this.damage} | Прочность: ${this.durability}/100`;
};
 
/**
 * Использует оружие — уменьшает прочность на 10.
 */
WeaponConstructor.prototype.use = function () {
  if (this.durability > 0) {
    this.durability = Math.max(0, this.durability - 10);
    console.log(`"${this.name}" использовано. Прочность: ${this.durability}/100`);
  } else {
    console.log(`"${this.name}" сломано!`);
  }
};
 
/**
 * Восстанавливает прочность до 100.
 */
WeaponConstructor.prototype.repair = function () {
  this.durability = 100;
  console.log(`"${this.name}" починено. Прочность: 100/100`);
};
 
// Тестирование функций-конструкторов
const shield = new ItemConstructor("Iron Shield", 6.0, "uncommon");
console.log(shield.getInfo());
shield.setWeight(5.5);
 
console.log();
 
const dagger = new WeaponConstructor("Shadow Dagger", 0.8, "legendary", 45, 100);
console.log(dagger.getInfo());
dagger.use();
dagger.use();
console.log("Прочность:", dagger.durability); // 80
dagger.repair();
 
// Проверяем наследование
console.log("\nПроверка instanceof:");
console.log("dagger instanceof WeaponConstructor →", dagger instanceof WeaponConstructor); // true
console.log("dagger instanceof ItemConstructor   →", dagger instanceof ItemConstructor);   // true
