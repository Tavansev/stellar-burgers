import { expect, test } from '@playwright/test';

const INGREDIENTS_HAR = 'tests/hars/ingredients.har';
const USER_HAR = 'tests/hars/user.har';
const ORDER_HAR = 'tests/hars/order.har';

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR(INGREDIENTS_HAR, {
      url: '**/api/ingredients',
      update: false,
    });
    await page.routeFromHAR(USER_HAR, {
      url: '**/api/auth/user',
      update: false,
    });
    await page.routeFromHAR(ORDER_HAR, {
      url: '**/api/orders',
      update: false,
    });
  });

  test('добавление ингредиента из списка в конструктор', async ({ page }) => {
    await page.goto('/');

    const ingredientCard = page.getByText('Краторная булка N-200i').first();
    await expect(ingredientCard).toBeVisible();

    const constructor = page.getByTestId('constructor');

    // Проверяем, что ДО клика булки в конструкторе НЕТ
    await expect(constructor.getByText('Выберите булки').first()).toBeVisible();

    const addButton = page
      .locator('li')
      .filter({ hasText: 'Краторная булка N-200i' })
      .getByRole('button', { name: 'Добавить' });

    await addButton.click();

    // После клика булка ПОЯВИЛАСЬ
    await expect(constructor.getByText('Краторная булка N-200i (верх)')).toBeVisible();
    await expect(constructor.getByText('Краторная булка N-200i (низ)')).toBeVisible();
  });

  test('открытие и закрытие модального окна ингредиента по крестику', async ({
    page,
  }) => {
    await page.goto('/');

    const modal = page.getByTestId('modal');

    // Проверяем, что ДО клика модалки НЕТ
    await expect(modal).not.toBeVisible();

    await page.getByText('Краторная булка N-200i').first().click();

    // После клика модалка ПОЯВИЛАСЬ
    await expect(modal).toBeVisible();
    await expect(modal.getByText('Детали ингредиента')).toBeVisible();
    await expect(modal.getByText('Краторная булка N-200i')).toBeVisible();

    await page.getByLabel('Закрыть').click();
    await expect(modal).not.toBeVisible();
  });

  test('открытие и закрытие модального окна ингредиента по оверлею', async ({
    page,
  }) => {
    await page.goto('/');

    const modal = page.getByTestId('modal');

    // Проверяем, что ДО клика модалки НЕТ
    await expect(modal).not.toBeVisible();

    await page.getByText('Соус Spicy-X').first().click();

    // После клика модалка ПОЯВИЛАСЬ
    await expect(modal).toBeVisible();
    await expect(modal.getByText('Соус Spicy-X')).toBeVisible();

    await page.getByTestId('modal-overlay').click({ position: { x: 5, y: 5 } });
    await expect(modal).not.toBeVisible();
  });

  test('создание заказа', async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'mockAccessToken',
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'mockRefreshToken');
    });

    await page.goto('/');

    const constructor = page.getByTestId('constructor');

    // Проверяем, что ДО добавления конструктор ПУСТ
    await expect(constructor.getByText('Выберите булки').first()).toBeVisible();
    await expect(constructor.getByText('Выберите начинку')).toBeVisible();

    // Добавляем булку
    await page
      .locator('li')
      .filter({ hasText: 'Краторная булка N-200i' })
      .getByRole('button', { name: 'Добавить' })
      .click();

    // Проверяем, что булка ПОЯВИЛАСЬ
    await expect(constructor.getByText('Краторная булка N-200i (верх)')).toBeVisible();

    // Добавляем начинку
    await page
      .locator('li')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
      .getByRole('button', { name: 'Добавить' })
      .click();

    // Проверяем, что начинка ПОЯВИЛАСЬ в конструкторе
    await expect(
      constructor.getByText('Биокотлета из марсианской Магнолии')
    ).toBeVisible();

    // Оформляем заказ
    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();

    // Проверяем, что в модалке ПРАВИЛЬНЫЙ номер заказа
    await expect(modal.getByTestId('order-number')).toHaveText('2934');

    await page.getByLabel('Закрыть').click();
    await expect(modal).not.toBeVisible();

    // Проверяем, что конструктор ОЧИСТИЛСЯ ПОЛНОСТЬЮ:
    // булка, начинка исчезли, надписи «Выберите булки» / «Выберите начинку» вернулись
    await expect(
      constructor.getByText('Краторная булка N-200i (верх)')
    ).not.toBeVisible();
    await expect(
      constructor.getByText('Биокотлета из марсианской Магнолии')
    ).not.toBeVisible();
    await expect(constructor.getByText('Выберите булки').first()).toBeVisible();
    await expect(constructor.getByText('Выберите начинку')).toBeVisible();
  });
});
