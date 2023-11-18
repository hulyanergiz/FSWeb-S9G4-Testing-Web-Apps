import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import IletisimFormu from "./IletisimFormu";

test("hata olmadan render ediliyor", () => {
  render(<IletisimFormu />);
});
beforeEach(() => {
  render(<IletisimFormu />);
});

test("iletişim formu headerı render ediliyor", () => {
  expect(screen.getByText("İletişim Formu")).toBeInTheDocument();
});

test("kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.", async () => {
  const ad = screen.getByPlaceholderText("İlhan");
  fireEvent.change(ad, { target: { value: "test" } });
  await waitFor(() => {
    expect(screen.queryAllByTestId("error")).toHaveLength(1);
  });
});

test("kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.", async () => {
  fireEvent(screen.getByText("Gönder"), new MouseEvent("click"));
  await waitFor(() => {
    expect(screen.queryAllByTestId("error")).toHaveLength(3);
  });
});
test("kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.", async () => {
  const ad = screen.getByLabelText("Ad*");
  fireEvent.change(ad, { target: { value: "test1" } });
  const soyad = screen.getByLabelText("Soyad*");
  fireEvent.change(soyad, { target: { value: "t" } });
  fireEvent(screen.getByText("Gönder"), new MouseEvent("click"));
  await waitFor(() => {
    expect(screen.queryAllByTestId("error")).toHaveLength(1);
  });
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  const email = screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com");
  fireEvent.change(email, { target: { value: "t" } });
  expect(screen.queryByTestId("error")).toHaveTextContent(
    "email geçerli bir email adresi olmalıdır."
  );
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
  const ad = screen.getByLabelText("Ad*");
  fireEvent.change(ad, { target: { value: "test1" } });
  const email = screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com");
  fireEvent.change(email, { target: { value: "yüzyılıngolcüsü@hotmail.com" } });
  fireEvent(screen.getByText("Gönder"), new MouseEvent("click"));
  await waitFor(() => {
    expect(screen.queryByTestId("error")).toHaveTextContent(
      "soyad gereklidir."
    );
  });
});

test("ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.", async () => {
  const ad = screen.getByLabelText("Ad*");
  fireEvent.change(ad, { target: { value: "test1" } });
  const soyad = screen.getByLabelText("Soyad*");
  fireEvent.change(soyad, { target: { value: "t" } });
  const email = screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com");
  fireEvent.change(email, { target: { value: "yüzyılıngolcüsü@hotmail.com" } });
  fireEvent(screen.getByText("Gönder"), new MouseEvent("click"));
  await waitFor(() => {
    expect(screen.queryAllByTestId("error")).toHaveLength(0);
  });
});

test("form gönderildiğinde girilen tüm değerler render ediliyor.", async () => {
  const ad = screen.getByLabelText("Ad*");
  fireEvent.change(ad, { target: { value: "testt" } });
  const soyad = screen.getByLabelText("Soyad*");
  fireEvent.change(soyad, { target: { value: "t" } });
  const email = screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com");
  fireEvent.change(email, { target: { value: "yüzyılıngolcüsü@hotmail.com" } });
  const message = screen.getByLabelText("Mesaj");
  fireEvent.change(message, { target: { value: "Mesaj" } });
  fireEvent(screen.getByText("Gönder"), new MouseEvent("click"));
  await waitFor(() => {
    expect(screen.getByTestId("firstnameDisplay")).toHaveTextContent("testt");
    expect(screen.getByTestId("lastnameDisplay")).toHaveTextContent("t");
    expect(screen.getByTestId("emailDisplay")).toHaveTextContent(
      "yüzyılıngolcüsü@hotmail.com"
    );
    expect(screen.getByTestId("messageDisplay")).toHaveTextContent("Mesaj");
  });
});
