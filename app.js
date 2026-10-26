// 공통 DOM 선택 함수
const $ = (s) => document.querySelector(s),
  $$ = (s) => [...document.querySelectorAll(s)];

// 01. 실시간 이용 현황 · 공간명, 이미지, 이용 좌석, 전체 좌석
const seats = [
  ["PC 게임존", "main/pc_zone.png", 32, 40],
  ["콘솔존", "main/console_zone.png", 12, 20],
  ["VR 체험존", "main/vr_zone.png", 6, 10],
  ["스트리밍 스튜디오", "main/streming_zone.png", 3, 6],
];
$("#seat-list").innerHTML = seats
  .map(
    ([name, img, n, total], i) =>
      /* HTML */ `<article class="seat-card">
        <img src="assets/${img}" alt="${name}" loading="lazy" />
        <h3>${name}</h3>
        <div class="seat-value">
          <strong>${n}석<small>/${total}석</small></strong
          ><small>${Math.round((n / total) * 100)}%</small>
        </div>
        <div class="meter"><i style="width:${(n / total) * 100}%"></i></div>
        <a href="reservation.html?space=${i}">좌석 예약하기 →</a>
      </article>`,
  )
  .join("");
// 모바일 공간 슬라이더: 첫 장은 다음만, 마지막 장은 이전만 표시합니다.
const seatList = $("#seat-list");
const seatNext = $(".seat-next");
const seatPrev = document.createElement("button");
seatPrev.type = "button";
seatPrev.className = "seat-prev round";
seatPrev.setAttribute("aria-label", "이전 공간");
seatPrev.textContent = "←";
seatNext.before(seatPrev);
let seatIndex = 0;
function seatStep() {
  return seatList.children[1].offsetLeft - seatList.children[0].offsetLeft;
}
function updateSeatArrows() {
  const max = seatList.scrollWidth - seatList.clientWidth;
  seatIndex = Math.round(seatList.scrollLeft / Math.max(1, seatStep()));
  seatPrev.hidden = seatList.scrollLeft <= 2;
  seatNext.hidden = max <= 2 || seatList.scrollLeft >= max - 2;
}
function moveSeat(delta) {
  seatIndex = Math.max(0, Math.min(seats.length - 1, seatIndex + delta));
  seatList.scrollTo({ left: seatIndex * seatStep(), behavior: "smooth" });
}
seatPrev.onclick = () => moveSeat(-1);
seatNext.onclick = () => moveSeat(1);
seatList.addEventListener("scroll", updateSeatArrows, { passive: true });
window.addEventListener("resize", updateSeatArrows);
updateSeatArrows();

// 각 카드가 보일 때 해당 비율만큼 그라데이션 게이지를 채웁니다.
const meterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-meter-visible");
      meterObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.35 },
);
$$(".seat-card").forEach((card) => meterObserver.observe(card));

// 이미지와 프로필을 이 배열에서 교체하세요. 게임별 다섯 명을 유지합니다.

// 02. 우승자 데이터 · 게임별 선수 5명, image는 assets 기준 파일명
const players = {
  lol: [
    {
      image: "main/figma/pc-imgRectangle49.png",
      name: "HARU",
      realName: "이준서",
      age: "17세",
      tier: "Challenger",
      position: "JUNGLE",
      team: "Team Nova Academy",
      bio: "빠른 판단과 과감한 동선으로\n경기 흐름을 바꾸는 공격형 정글러",
    },
    {
      image: "main/figma/pc-imgRectangle50.png",
      name: "ZERO",
      realName: "김도현",
      age: "18세",
      tier: "Grandmaster",
      position: "MID",
      team: "Team Vertex",
      bio: "안정적인 라인전과 정확한 스킬 활용으로\n중심을 잡아주는 밸런스형 미드라이너",
    },
    {
      image: "main/figma/pc-imgRectangle51.png",
      name: "LUNE",
      realName: "박시우",
      age: "17세",
      tier: "Challenger",
      position: "ADC",
      team: "Nova Youth",
      bio: "침착한 포지셔닝과 높은 집중력으로\n후반 교전을 책임지는 원거리 딜러",
    },
    {
      image: "main/figma/champion1.png",
      name: "CROW",
      realName: "최민재",
      age: "18세",
      tier: "Grandmaster",
      position: "TOP",
      team: "Team Orbit",
      bio: "단단한 라인전과 과감한 진입으로\n전투의 시작을 만들어내는 탑 라이너",
    },
    {
      image: "main/figma/champion2.png",
      name: "MINT",
      realName: "정우진",
      age: "17세",
      tier: "Master",
      position: "SUPPORT",
      team: "Aster Academy",
      bio: "넓은 시야와 빠른 상황 판단으로\n팀의 플레이를 연결하는 서포터",
    },
  ],

  val: [
    {
      image: "main/figma/champion3.png",
      name: "RIN",
      realName: "박도윤",
      age: "17세",
      tier: "Radiant",
      position: "DUELIST",
      team: "Aster Academy",
      bio: "빠른 진입과 과감한 교전으로\n상대의 흐름을 끊는 공격형 듀얼리스트",
    },
    {
      image: "main/figma/champion4.png",
      name: "NOAH",
      realName: "김태윤",
      age: "18세",
      tier: "Immortal 3",
      position: "CONTROLLER",
      team: "Team Vertex",
      bio: "안정적인 스킬 활용과 침착한 운영으로\n팀의 전투 흐름을 조율하는 컨트롤러",
    },
    {
      image: "main/figma/champion5.png",
      name: "JUNE",
      realName: "오민준",
      age: "17세",
      tier: "Immortal 2",
      position: "INITIATOR",
      team: "Nova Youth",
      bio: "정확한 정보 수집과 빠른 판단으로\n교전의 시작을 만들어내는 이니시에이터",
    },
    {
      image: "main/figma/champion6.png",
      name: "MIN",
      realName: "한지호",
      age: "18세",
      tier: "Radiant",
      position: "SENTINEL",
      team: "Team Orbit",
      bio: "안정적인 수비와 세밀한 포지셔닝으로\n팀의 후방을 책임지는 센티널",
    },
    {
      image: "main/figma/champion7.png",
      name: "KAI",
      realName: "윤서준",
      age: "17세",
      tier: "Immortal 3",
      position: "DUELIST",
      team: "Arc Academy",
      bio: "빠른 피지컬과 적극적인 진입으로\n교전의 분위기를 바꾸는 듀얼리스트",
    },
  ],
};

// 우승자 캐러셀 · 드래그, 터치, 버튼, 키보드 조작
let game = "lol",
  winner = 0;

// 카드를 매번 다시 만들지 않고 위치만 바꾸어 부드럽게 이동합니다.
function renderPlayers() {
  const track = $("#winner-track");
  if (track.dataset.game !== game) {
    track.dataset.game = game;
    track.innerHTML = players[game]
      .map(
        (p, i) => /* HTML */ `
          <article
            class="winner-card"
            data-index="${i}"
            aria-label="${p.name} 프로필"
          >
            ${p.image
            ? /* HTML */ `<img
                  src="assets/${p.image}"
                  alt="${p.name}"
                  draggable="false"
                />`
            : /* HTML */ `<div class="placeholder">
                  <strong>0${i + 1}</strong><span>PLAYER IMAGE</span
                  ><small>선수 이미지 준비 중</small>
                </div>`}
            <div class="profile">
              <small>CHAMPION</small>
              <div class="profile-details">
                <h3>${p.name}</h3>
                <p>${p.realName} · ${p.age}</p>
                <dl>
                  <div>
                    <dt>TIER</dt>
                    <dd>${p.tier || "—"}</dd>
                  </div>
                  <div>
                    <dt>POSITION</dt>
                    <dd>${p.position || "—"}</dd>
                  </div>
                  <div>
                    <dt>TEAM</dt>
                    <dd>${p.team || "—"}</dd>
                  </div>
                </dl>
                ${p.bio
            ? `<p class="profile-bio">${p.bio.replace("\n", "<br />")}</p>`
            : ""}
              </div>
            </div>
          </article>
        `,
      )
      .join("");
  }
  $$(".winner-card").forEach((card, i) => {
    let offset = (i - winner + 5) % 5;
    if (offset > 2) offset -= 5;
    card.style.setProperty("--offset", offset);
    card.style.setProperty("--scale", offset === 0 ? 1 : 0.87);
    card.style.setProperty("--angle", offset * 13 + "deg");
    card.style.opacity = offset < 0 ? "0" : "1";
    card.style.zIndex = 5 - Math.abs(offset);
    card.classList.toggle("active", offset === 0);
    card.classList.toggle("show-profile", offset === 0);
    card.setAttribute("aria-expanded", offset === 0 ? "true" : "false");
    card.tabIndex = offset === 0 ? 0 : -1;
    card.setAttribute("aria-hidden", offset < 0 ? "true" : "false");
  });
  $("#winner-dots").innerHTML = players[game]
    .map(
      (_, i) => /* HTML */ `
        <button
          class="${i === winner ? "active" : ""}"
          data-index="${i}"
          aria-label="${i + 1}번째 선수"
          aria-current="${i === winner}"
        ></button>
      `,
    )
    .join("");
}
function moveWinner(delta) {
  winner = (winner + delta + 5) % 5;
  renderPlayers();
}
$("#winner-prev").onclick = () => moveWinner(-1);
$("#winner-next").onclick = () => moveWinner(1);
$("#winner-dots").onclick = (e) => {
  const b = e.target.closest("button");
  if (b) {
    winner = +b.dataset.index;
    renderPlayers();
  }
};
$$(".game-tabs button[data-game]").forEach(
  (b) =>
  (b.onclick = () => {
    game = b.dataset.game;
    winner = 0;
    $$(".game-tabs button[data-game]").forEach((t) =>
      t.setAttribute("aria-selected", t === b),
    );
    $("#game-title").textContent = game === "lol" ? "LOL" : "VAL";
    renderPlayers();
  }),
);
let startX = 0,
  startY = 0,
  dragged = false;
const stage = $(".winner-stage");
stage.addEventListener("pointerdown", (e) => {
  startX = e.clientX;
  startY = e.clientY;
  dragged = false;
  if (!e.isPrimary || e.button !== 0) return;
  stage.setPointerCapture(e.pointerId);
});
stage.addEventListener("pointerup", (e) => {
  if (!stage.hasPointerCapture(e.pointerId)) return;
  stage.releasePointerCapture(e.pointerId);
  let dx = e.clientX - startX,
    dy = e.clientY - startY;
  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
    dragged = true;
    moveWinner(dx < 0 ? 1 : -1);
  } else if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
    const p = document
      .elementFromPoint(e.clientX, e.clientY)
      ?.closest(".winner-card");
    if (p) {
      if (+p.dataset.index === winner) toggleProfile(p);
      else {
        winner = +p.dataset.index;
        renderPlayers();
      }
    }
  }
});
stage.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
    e.preventDefault();
    moveWinner(e.key === "ArrowRight" ? 1 : -1);
  }
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    toggleProfile($(".winner-card.active"));
  }
});
function toggleProfile(card) {
  if (!card) return;
  const visible = card.classList.toggle("show-profile");
  card.setAttribute("aria-expanded", String(visible));
}
renderPlayers();

// 03. 프로그램 데이터 · 제목, 이미지, 설명, 태그를 여기서 수정
const programs = [
  {
    name: "e스포츠 아카데미",
    image: "main/figma/mobile-imgRectangle68.png",
    description:
      "전문적인 코칭과 실전 중심의 훈련을 통해\n자신만의 플레이 스타일과 가능성을 발견해 보세요.",
    tags: [
      "입문 ~ 고급",
      "포지션별 코칭",
      "팀워크 훈련",
      "1:1 코칭",
      "실전 스크림",
    ],
  },
  {
    name: "아마추어 리그",
    image: "main/amateur_league.png",
    description:
      "도전하는 모든 플레이어를 위한 무대.\n동료들과 팀을 이루고 함께 승리의 순간을 만들어보세요.",
    tags: ["팀 토너먼트", "실전 경기", "아마추어 리그", "랭킹전", "현장 경기"],
  },
  {
    name: "크리에이터 스쿨",
    image: "main/creator_school.png",
    description:
      "나만의 콘텐츠로 세상과 소통하는 시간.\n방송 기획부터 촬영까지 함께 배우고 만들어보세요.",
    tags: ["콘텐츠 기획", "스토리 보드 · 영상 제작", "스트리밍", "편집 실습", "채널 운영"],
  },
  {
    name: "나만의 게임 만들기",
    image: "main/game_maker.png",
    description:
      "상상 속 아이디어가 새로운 게임이 되는 곳.\n함께 기획하고 직접 만드는 게임 제작 프로그램입니다.",
    tags: ["게임 기획", "캐릭터 제작", "UI 디자인", "결과물 제작", "개발 체험"],
  },
  {
    name: "플레이 투게더",
    image: "main/figma/pc-imgRectangle68.png",
    description:
      "혼자 즐기던 게임을 함께 나누는 커뮤니티 프로그램입니다.\n콘솔, 보드게임, 협동 게임 등 다양한 활동을 통해 새로운 플레이 경험을 만나보세요.",
    tags: ["콘솔 플레이", "협동 게임", "커뮤니티 매치", "친구와 함께", "자유 참여"],
  },
];

// 프로그램 탭과 이전 / 다음 버튼
let program = 0;
$("#program-tabs").innerHTML = programs
  .map(
    (p, i) =>
      /* HTML */ `<button
        role="tab"
        data-index="${i}"
        aria-controls="program-title"
      >
        ${p.name}
      </button>`,
  )
  .join("");
function animate(el) {
  el.classList.remove("swap");
  void el.offsetWidth;
  el.classList.add("swap");
}
function renderProgram() {
  const p = programs[program];
  $("#program-title").textContent = p.name;
  $("#program-description").textContent = p.description;
  $("#program-image").src = "assets/" + p.image;
  $("#program-image").alt = p.name;
  $("#program-tags").innerHTML = p.tags
    .map((t) => /* HTML */ `<span>${t}</span>`)
    .join("");
  $("#program-count").textContent = program + 1;
  $("#program-progress").style.width = (program + 1) * 20 + "%";
  $$("#program-tabs button").forEach((b, i) =>
    b.setAttribute("aria-selected", i === program),
  );
  animate($(".program-content"));
}
$("#program-tabs").onclick = (e) => {
  const b = e.target.closest("button");
  if (b) {
    program = +b.dataset.index;
    renderProgram();
  }
};
$("#program-prev").onclick = () => {
  program = (program + 4) % 5;
  renderProgram();
};
$("#program-next").onclick = () => {
  program = (program + 1) % 5;
  renderProgram();
};
renderProgram();

// 04. 공간 데이터 · 이름, 이미지, 설명을 여기서 수정
const spaces = [
  {
    name: "PC GAMING ZONE",
    image: "main/z_pcgame.png",
    description:
      "고성능 PC와 쾌적한 게이밍 환경\n친구와 함께 몰입하는 플레이 공간\n\n2F · PC 게임존",
  },
  {
    name: "CONSOLE ZONE",
    image: "main/figma/pc-imgRectangle69.png",
    description:
      "PlayStation, Xbox 등 \n다양한 콘솔 게임을 편안하게 즐기는 \n휴식형 플레이 공간\n\n2F · ZONE B",
  },
  {
    name: "VR EXPERIENCE",
    image: "main/z_vrzone.png",
    description:
      "현실을 넘어 새로운 세계로\n생생하게 경험하는 가상현실 콘텐츠\n\n3F · VR 체험존",
  },
  {
    name: "ESPORTS ARENA",
    image: "main/z_esport.png",
    description:
      "뜨거운 응원과 짜릿한 승부의 순간\n함께 즐기는 e스포츠 전용 경기장\n\n1F · GGROUND ARENA",
  },
];
$("#space-accordion").innerHTML = spaces
  .map(
    (s, i) =>
      /* HTML */ `<div class="space-item">
        <button
          aria-expanded="false"
          aria-controls="space-detail-${i}"
          data-index="${i}"
        >
          ${s.name}
        </button>
        <div class="space-description" id="space-detail-${i}">
          <div><p>${s.description}</p></div>
        </div>
      </div>`,
  )
  .join("");
function openSpace(i) {
  $$(".space-item").forEach((el, n) => {
    el.classList.toggle("active", n === i);
    el.querySelector("button").setAttribute("aria-expanded", n === i);
  });
  $("#space-image").src = "assets/" + spaces[i].image;
  $("#space-image").alt = spaces[i].name;
  $("#space-mobile-description").textContent = spaces[i].description;
  animate($(".space-visual"));
}
$("#space-accordion").onclick = (e) => {
  const b = e.target.closest("button");
  if (b) openSpace(+b.dataset.index);
};
openSpace(0);

// 05. 브랜드 소개 문구 · 스크롤 진행에 따라 한 글자씩 채색
const sentence =
  "GGROUND는 게임을 즐기는 공간을 넘어\n새로운 게임문화를 만듭니다.";
$("#scroll-text").innerHTML = [...sentence]
  .map((c, i) =>
    c === "\n"
      ? "<br>"
      : /* HTML */ `<span data-char="${i}" aria-hidden="true"
          >${c === " " ? "&nbsp;" : c}</span
        >`,
  )
  .join("");
// 스크롤 구간 동안 화면을 고정하고, 도착 후 한 글자씩 채색합니다.
const aboutSection = $(".about");
const aboutImages = $$(".about .floating");
const chars = $$("#scroll-text span");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const sticky = document.createElement("div");
const scene = document.createElement("div");
const artwork = document.createElement("div");
sticky.className = "about-sticky";
scene.className = "about-scene";
artwork.className = "about-artwork";
while (aboutSection.firstChild) artwork.append(aboutSection.firstChild);
scene.append(artwork);
sticky.append(scene);
aboutSection.append(sticky);
aboutImages.forEach((image, i) =>
  image.style.setProperty("--reveal-delay", i * 200 + "ms"),
);
let pending = false;
let scrollDistance = 1000;
let lastColored = -1;
function sizeAbout() {
  scrollDistance = reducedMotion.matches ? 0 : Math.max(900, innerHeight);
  aboutSection.style.setProperty("--about-scroll", scrollDistance + "px");
  requestScrollColor();
}
function scrollColor() {
  pending = false;
  if (getComputedStyle(aboutSection).display === "none") return;
  const top = aboutSection.getBoundingClientRect().top;
  // 처음 12%는 이미지 등장 여유, 마지막 8%는 완성된 문장 감상 시간입니다.
  const progress = reducedMotion.matches
    ? 1
    : Math.max(0, Math.min(1, (-top / scrollDistance - 0.12) / 0.8));
  if (top < innerHeight * 0.25 || reducedMotion.matches) {
    aboutImages.forEach((image) => image.classList.add("visible"));
  }
  const colored = Math.floor(progress * chars.length);
  if (colored === lastColored) return;
  lastColored = colored;
  chars.forEach((span, i) => {
    span.style.color =
      i < colored
        ? +span.dataset.char < 7
          ? "#556BFF"
          : "#252527"
        : "#c5c5c5";
  });
}
function requestScrollColor() {
  if (pending) return;
  pending = true;
  requestAnimationFrame(scrollColor);
}
window.addEventListener("scroll", requestScrollColor, { passive: true });
window.addEventListener("resize", sizeAbout);
reducedMotion.addEventListener("change", sizeAbout);
sizeAbout();

// 06. 화면에 들어오는 요소의 등장 효과
const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        observer.unobserve(e.target);
      }
    }),
  { threshold: 0.12 },
);
$$(".reveal")
  .filter((el) => !el.closest(".about"))
  .forEach((el) => observer.observe(el));

// 07. 안내 팝업과 닫기 동작
$$("[data-info]").forEach(
  (b) =>
  (b.onclick = () => {
    $("#info-message").textContent = b.dataset.info;
    $("#info-dialog").showModal();
  }),
);
$$(".dialog-close").forEach(
  (b) => (b.onclick = () => b.closest("dialog").close()),
);
$$("dialog").forEach((d) =>
  d.addEventListener("click", (e) => {
    if (e.target === d) {
      const r = d.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      )
        d.close();
    }
  }),
);

// 08. 사이트 검색 · 검색어와 이동할 링크
const searchItems = [
  ["공간 · PC · 콘솔 · VR", "#spaces"],
  ["프로그램 · 교육 · 아카데미", "#programs"],
  ["이용 안내 · 운영시간", "#guide"],
  ["예약 · 좌석", "reservation.html"],
  ["리그 · e스포츠 · 우승자", "#winners"],
];
function search() {
  const q = $("#search-input").value.trim().toLowerCase();
  const items = searchItems.filter(([name]) => name.toLowerCase().includes(q));
  $("#search-results").innerHTML = items.length
    ? items
      .map(([name, href]) => /* HTML */ `<a href="${href}">${name} →</a>`)
      .join("")
    : "<p>검색 결과가 없습니다.</p>";
}
$("#search-open").onclick = () => {
  $("#search-dialog").showModal();
  search();
  $("#search-input").focus();
};
$("#search-input").oninput = search;
$("#search-results").onclick = (e) => {
  if (e.target.closest("a")) $("#search-dialog").close();
};

document.querySelector(".top-btn").onclick = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};