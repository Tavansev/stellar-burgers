import { expect, test } from '@playwright/test';

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/ingredients', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            {
              _id: '643d69a5c3f7b9001cfa093c',
              name: 'Краторная булка N-200i',
              type: 'bun',
              proteins: 80,
              fat: 24,
              carbohydrates: 53,
              calories: 420,
              price: 1255,
              image: 'https://code.s3.yandex.net/react/code/bun-02.png',
              image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
              image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
            },
            {
              _id: '643d69a5c3f7b9001cfa0941',
              name: 'Биокотлета из марсианской Магнолии',
              type: 'main',
              proteins: 420,
              fat: 142,
              carbohydrates: 242,
              calories: 4242,
              price: 424,
              image: 'https://code.s3.yandex.net/react/code/meat-01.png',
              image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
              image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
            },
            {
              _id: '643d69a5c3f7b9001cfa0942',
              name: 'Соус Spicy-X',
              type: 'sauce',
              proteins: 30,
              fat: 20,
              carbohydrates: 40,
              calories: 30,
              price: 90,
              image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
              image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
              image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
            },
          ],
        }),
      });
    });

    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: { email: 'test@test.com', name: 'TestUser' },
        }),
      });
    });

    await page.route('**/api/orders', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          name: 'Space Burger',
          order: {
            _id: 'mockOrderId',
            status: 'done',
            name: 'Space Burger',
            createdAt: '2025-01-01T00:00:00.000Z',
            updatedAt: '2025-01-01T00:00:00.000Z',
            number: 12345,
            ingredients: [],
          },
        }),
      });
    });
  });

  test('добавление ингредиента из списка в конструктор', async ({ page }) => {
    await page.goto('/');

    const ingredientCard = page.getByText('Краторная булка N-200i').first();
    await expect(ingredientCard).toBeVisible();

    const constructor = page.getByTestId('constructor');
    const addButton = page
      .locator('li')
      .filter({ hasText: 'Краторная булка N-200i' })
      .getByRole('button', { name: 'Добавить' });

    await addButton.click();

    await expect(constructor.getByText('Краторная булка N-200i (верх)')).toBeVisible();
    await expect(constructor.getByText('Краторная булка N-200i (низ)')).toBeVisible();
  });

  test('открытие и закрытие модального окна ингредиента по крестику', async ({
    page,
  }) => {
    await page.goto('/');

    await page.getByText('Краторная булка N-200i').first().click();

    const modal = page.getByTestId('modal');
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

    await page.getByText('Соус Spicy-X').first().click();

    const modal = page.getByTestId('modal');
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

    await page.goto('/');

    await page.evaluate(() => {
      localStorage.setItem('refreshToken', 'mockRefreshToken');
    });

    await page.reload();

    await page
      .locator('li')
      .filter({ hasText: 'Краторная булка N-200i' })
      .getByRole('button', { name: 'Добавить' })
      .click();

    await page
      .locator('li')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
      .getByRole('button', { name: 'Добавить' })
      .click();

    const constructor = page.getByTestId('constructor');
    await expect(constructor.getByText('Краторная булка N-200i (верх)')).toBeVisible();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(modal.getByTestId('order-number')).toHaveText('12345');

    await page.getByLabel('Закрыть').click();
    await expect(modal).not.toBeVisible();

    await expect(constructor.getByText('Выберите булки').first()).toBeVisible();
  });
});