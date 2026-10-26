/* 예약 페이지 전용. 메인 app.js를 불러오거나 수정하지 않습니다. */
(() => {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const assets = "assets/reservation/";

  // 공간 설정: 요금과 이용 중 좌석은 화면 구현용 예시입니다.
  // 실서비스 연결 시 서버가 반환한 날짜·시간별 현황과 요금으로 교체하세요.
  const zones = [
    {
      id: "pc",
      name: "PC 게임존",
      prefix: "P",
      count: 20,
      rate: 1500,
      icon: "icons8-my-computer-96 (1) 1.png",
      activeIcon: "pc_hover.png",
      tagline: "고사양 PC로 즐기는 최고의 플레이",
      description: "최신 사양의 게임 PC와 쾌적한 환경에서 게임을 즐겨보세요.",
      occupied: [4, 13],
    },
    {
      id: "console",
      name: "콘솔존",
      prefix: "C",
      count: 6,
      rate: 1500,
      icon: "game-controller 1.png",
      activeIcon: "console_hover.png",
      tagline: "다양한 콘솔 게임을 한 공간에서",
      description:
        "대형 화면과 편안한 좌석에서 함께 즐기는 콘솔 게임 공간입니다.",
      occupied: [4],
    },
    {
      id: "vr",
      name: "VR 체험존",
      prefix: "V",
      count: 8,
      rate: 1500,
      icon: "icons8-oculus-rift-50 1.png",
      activeIcon: "vr_hover.png",
      tagline: "몰입감 넘치는 가상현실 체험",
      description:
        "개별 체험 부스에서 자유롭게 움직이며 새로운 세계를 만나보세요.",
      occupied: [3, 7],
    },
    {
      id: "studio",
      name: "스트리밍 스튜디오",
      prefix: "S",
      count: 3,
      rate: 1500,
      icon: "icons8-streaming-96 (1) 1.png",
      activeIcon: "streaming_hover.png",
      tagline: "나만의 콘텐츠를 만드는 크리에이터 공간",
      description:
        "촬영과 방송에 집중할 수 있는 독립형 스트리밍 스튜디오입니다.",
      occupied: [2],
    },
  ];
  const requestedSpace = new URLSearchParams(location.search).get("space");
  let zoneIndex =
    /^\d$/.test(requestedSpace || "") && Number(requestedSpace) < zones.length
      ? Number(requestedSpace)
      : 0;
  const selected = new Set();
  const dateInput = $("#booking-date");
  const timeInput = $("#booking-time");
  const peopleInput = $("#booking-people");
  const dateString = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const today = new Date();
  dateInput.min = dateString(today);
  const firstDate = new Date(today);
  if (firstDate.getDay() === 1 || firstDate.getHours() >= 20)
    firstDate.setDate(firstDate.getDate() + 1);
  if (firstDate.getDay() === 1) firstDate.setDate(firstDate.getDate() + 1);
  dateInput.value = dateString(firstDate);
  const money = (number) => `${number.toLocaleString("ko-KR")}원`;
  const seatId = (number) =>
    `${zones[zoneIndex].prefix}${String(number).padStart(2, "0")}`;

  // 카테고리: 메인 좌석 예약 링크의 ?space=0~3도 지원합니다.
  $(".reservation-tabs").innerHTML = zones
    .map(
      (zone, index) => `
    <button type="button" class="reservation-tab" id="zone-tab-${index}" role="tab"
      aria-controls="zone-panel" aria-selected="false" data-zone-index="${index}">
      <img src="${assets + zone.icon}" alt="">
      <span><strong>${zone.name}</strong><small>${zone.tagline}</small></span>
    </button>`,
    )
    .join("");

  function seatMarkup(number) {
    const occupied = zones[zoneIndex].occupied.includes(number);
    const id = seatId(number);
    return `<button type="button" class="reservation-seat" data-seat="${id}"
      aria-label="${id} ${occupied ? "이용 중" : "좌석"}" aria-pressed="false"
      ${occupied ? "disabled" : ""}>
      <span>${id}</span>${
        occupied
          ? '<span class="seat-unavailable" aria-hidden="true">×</span>'
          : `<img src="${assets}seat-chair.svg" alt="">`
      }</button>`;
  }

  function renderZone() {
    const zone = zones[zoneIndex];
    selected.clear();
    document.querySelectorAll(".reservation-tab").forEach((button, index) => {
      const active = index === zoneIndex;
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
      button.querySelector("img").src =
        assets + (active ? zones[index].activeIcon : zones[index].icon);
    });
    $("#zone-panel").setAttribute("aria-labelledby", `zone-tab-${zoneIndex}`);
    $("#zone-icon").src = assets + zone.icon;
    $("#zone-name").textContent = zone.name;
    $("#zone-description").textContent = zone.description;
    $(".reservation-room").dataset.zone = zone.id;
    $("#seat-map").setAttribute("aria-label", `${zone.name} 좌석`);
    let map = "";
    if (zone.id === "pc") {
      map = Array.from({ length: zone.count }, (_, index) =>
        seatMarkup(index + 1),
      ).join("");
    } else if (zone.id === "console") {
      map = Array.from(
        { length: 3 },
        (_, index) => `<div class="seat-cluster">
        <span class="cluster-label">CONSOLE ${String(index + 1).padStart(2, "0")}</span>
        <span class="console-screen" aria-hidden="true">PLAY TOGETHER</span>
        ${seatMarkup(index * 2 + 1)}${seatMarkup(index * 2 + 2)}</div>`,
      ).join("");
    } else {
      map = Array.from(
        { length: zone.count },
        (_, index) => `<div class="seat-cluster">
        <span class="cluster-label">${zone.id === "vr" ? "VR BOOTH" : "STUDIO"} ${String(index + 1).padStart(2, "0")}</span>
        ${zone.id === "studio" ? '<span class="studio-desk" aria-hidden="true">ON AIR</span>' : ""}
        ${seatMarkup(index + 1)}</div>`,
      ).join("");
    }
    $("#seat-map").innerHTML = map;
    peopleInput.innerHTML = Array.from(
      { length: zone.count - zone.occupied.length },
      (_, index) => `<option value="${index + 1}">${index + 1}명</option>`,
    ).join("");
    peopleInput.value = "1";
    $(".reservation-map-scroll").scrollLeft = 0;
    $("#rate-description").textContent =
      `${zone.name} ${money(zone.rate)} / 1시간`;
    $("#reservation-error").textContent = "";
    renderSelection("공간을 선택했습니다. 원하는 좌석을 선택해 주세요.");
  }

  // 좌석과 오른쪽 선택 목록은 같은 Set을 사용해 항상 함께 갱신합니다.
  function renderSelection(message) {
    document.querySelectorAll(".reservation-seat").forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(selected.has(button.dataset.seat)),
      );
    });
    $("#selected-seats").innerHTML = selected.size
      ? [...selected]
          .sort()
          .map(
            (id) => `<button type="button" class="selected-seat-chip"
          data-remove="${id}" aria-label="${id} 선택 취소">${id} <span aria-hidden="true">×</span></button>`,
          )
          .join("")
      : '<p class="selection-empty">배치도에서 좌석을 선택해 주세요.</p>';
    $("#total-price").textContent = money(
      selected.size * zones[zoneIndex].rate * 2,
    );
    $("#selection-announcement").textContent =
      message || `${selected.size}개 좌석 선택됨`;
  }

  function toggleSeat(id) {
    const button = [...document.querySelectorAll(".reservation-seat")].find(
      (item) => item.dataset.seat === id,
    );
    if (!button || button.disabled) return;
    if (selected.has(id)) selected.delete(id);
    else selected.add(id);
    peopleInput.value = String(Math.max(1, selected.size));
    $("#reservation-error").textContent = "";
    renderSelection();
  }
  $("#seat-map").addEventListener("click", (event) => {
    const button = event.target.closest("[data-seat]");
    if (button) toggleSeat(button.dataset.seat);
  });
  $("#selected-seats").addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove]");
    if (!button) return;
    toggleSeat(button.dataset.remove);
    const nextChip = $("#selected-seats button");
    (nextChip || $("#reset-seats")).focus();
  });
  $("#reset-seats").addEventListener("click", () => {
    selected.clear();
    peopleInput.value = "1";
    $("#reservation-error").textContent = "";
    renderSelection("선택한 좌석을 모두 취소했습니다.");
  });
  $(".reservation-tabs").addEventListener("click", (event) => {
    const button = event.target.closest("[data-zone-index]");
    if (!button || Number(button.dataset.zoneIndex) === zoneIndex) return;
    zoneIndex = Number(button.dataset.zoneIndex);
    renderZone();
  });
  $(".reservation-tabs").addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    zoneIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? 3
          : (zoneIndex + (event.key === "ArrowRight" ? 1 : 3)) % 4;
    renderZone();
    $(`#zone-tab-${zoneIndex}`).focus();
  });

  // 날짜/시간이 바뀌면 다른 예약 조건의 좌석 선택을 남기지 않습니다.
  function changeSchedule() {
    selected.clear();
    peopleInput.value = "1";
    dateInput.setCustomValidity("");
    if (
      dateInput.value &&
      new Date(`${dateInput.value}T12:00:00`).getDay() === 1
    ) {
      dateInput.setCustomValidity(
        "매주 월요일은 휴관입니다. 다른 날짜를 선택해 주세요.",
      );
    }
    $("#reservation-error").textContent = dateInput.validationMessage;
    renderSelection("이용 일정이 변경되어 좌석 선택을 초기화했습니다.");
  }
  dateInput.addEventListener("change", changeSchedule);
  timeInput.addEventListener("change", changeSchedule);
  $("#reservation-form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!selected.size) {
      $("#reservation-error").textContent = "예약할 좌석을 선택해 주세요.";
      return;
    }
    if (Number(peopleInput.value) !== selected.size) {
      $("#reservation-error").textContent =
        "이용 인원과 선택한 좌석 수를 맞춰 주세요.";
      return;
    }
    const start = new Date(`${dateInput.value}T${timeInput.value}:00:00`);
    if (start <= new Date()) {
      $("#reservation-error").textContent =
        "이미 지난 시간입니다. 다른 날짜 또는 시간을 선택해 주세요.";
      return;
    }
    $("#reservation-error").textContent = "";
    $("#reservation-result").textContent =
      `${zones[zoneIndex].name}\n${dateInput.value} · ${timeInput.selectedOptions[0].text}\n${peopleInput.value}명 · ${[...selected].sort().join(", ")}\n이용 요금 ${$("#total-price").textContent}`;
    $("#reservation-dialog").showModal();
  });

  // 헤더 검색과 팝업. 메인 페이지에 있는 검색 목적지를 그대로 연결합니다.
  const searchItems = [
    ["공간 · PC · 콘솔 · VR", "index.html#spaces"],
    ["프로그램 · 교육 · 아카데미", "index.html#programs"],
    ["이용 안내 · 운영시간", "index.html#guide"],
    ["예약 · 좌석", "reservation.html"],
    ["리그 · e스포츠 · 우승자", "index.html#winners"],
  ];
  function search() {
    const query = $("#search-input").value.trim().toLowerCase();
    const results = searchItems.filter(([name]) =>
      name.toLowerCase().includes(query),
    );
    $("#search-results").innerHTML = results.length
      ? results
          .map(([name, href]) => `<a href="${href}">${name} →</a>`)
          .join("")
      : "<p>검색 결과가 없습니다.</p>";
  }
  $("#search-open").onclick = () => {
    $("#search-dialog").showModal();
    search();
    $("#search-input").focus();
  };
  $("#search-input").oninput = search;
  document
    .querySelectorAll(".dialog-close")
    .forEach(
      (button) => (button.onclick = () => button.closest("dialog").close()),
    );
  renderZone();
})();
