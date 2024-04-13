/* eslint-disable no-param-reassign */
const billiard = (number) => {
  const body = document.querySelector('body');
  const over = document.querySelector('.over');
  const col = document.getElementById('col');
  const newGame = document.querySelector('.newGame');
  const stopGame = document.querySelector('.stopGame');
  const chooseColor = document.querySelector('.chooseColor');
  const numberInput = document.querySelector('.numberInput');
  const canvas = document.getElementById('canvas');
  const widthCanvas = 1200;
  const heightCanvas = 800;

  const colors = [
    'blue',
    'red',
    'yellow',
    'magenta',
    'orange',
    'brown',
    'purple',
    'pink',
  ];
  const radius = [20, 25, 30, 35, 40, 45];
  const maxRadius = 45;
  const balls = [];
  canvas.width = widthCanvas;
  canvas.height = heightCanvas;

  const randomXY = (r) => {
    const rx =
      Math.floor(Math.random() * (canvas.width - maxRadius * 2)) + maxRadius;
    const ry =
      Math.floor(Math.random() * (canvas.height - maxRadius * 2)) + maxRadius;
    if (balls.length > 0) {
      balls.forEach((ball, ind) => {
        const delta1 = Math.sqrt((rx - ball.x) ** 2 + (ry - ball.y) ** 2);
        const delta2 = Math.sqrt(
          (canvas.width / 2 - rx) ** 2 + (canvas.height / 2 - ry) ** 2
        );
        if (delta1 < maxRadius * 2 || delta2 < maxRadius * 1.1 - r) {
          balls.splice(ind, 1);
          return randomXY();
        }
        return null;
      });
    }
    return [rx, ry];
  };

  const decrement = (v, r) => {
    let t = v;
    t -= 2 * Math.sign(v);
    if (Math.abs(v) < r / 5) {
      t = 0;
    }
    return -Math.round(t);
  };

  const getXY = (e) => {
    const ex = e.clientX - canvas.getBoundingClientRect().left;
    const ey = e.clientY - canvas.getBoundingClientRect().top;
    return [ex, ey];
  };

  const initCanvas = () => {
    const ctx = canvas.getContext('2d');
    class Ball {
      constructor(r, x, y, vx, vy, color) {
        this.r = r;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
      }

      active = false;

      static collision(ball1, ball2) {
        const dx = ball1.x - ball2.x;
        const dy = ball1.y - ball2.y;
        const dc = Math.sqrt(dx * dx + dy * dy);
        const v1 = Math.sqrt(ball1.vx * ball1.vx + ball1.vy * ball1.vy);
        const v2 = Math.sqrt(ball2.vx * ball2.vx + ball2.vy * ball2.vy);
        const vmax = Math.max(v1, v2);
        const v1x = ball1.vx / vmax;
        const v1y = ball1.vy / vmax;
        const v2x = ball2.vx / vmax;
        const v2y = ball2.vy / vmax;
        const min = ball1.r + ball2.r;
        if (dc <= min) {
          const v1xNew = dx / dc + v1x;
          const v1yNew = dy / dc + v1y;
          const v2xNew = -dx / dc + v2x;
          const v2yNew = -dy / dc + v2y;
          const v1cNew = Math.sqrt(v1xNew * v1xNew + v1yNew * v1yNew);
          const v2cNew = Math.sqrt(v2xNew * v2xNew + v2yNew * v2yNew);
          const ratio = (v1 + v2) / (v1cNew + v2cNew);
          ball1.vx = v1xNew * ratio;
          ball1.vy = v1yNew * ratio;
          ball2.vx = v2xNew * ratio;
          ball2.vy = v2yNew * ratio;
        }
      }

      update() {
        for (let i = 0; i < balls.length - 1; i += 1) {
          for (let j = i + 1; j < balls.length; j += 1) {
            Ball.collision(balls[i], balls[j]);
          }
        }
        this.x += 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        this.update();
      }
    }

    const pocketOuter = new Ball(
      maxRadius * 1.4,
      canvas.width / 2,
      canvas.height / 2,
      0,
      0,
      'gray'
    );
    const pocketInner = new Ball(
      maxRadius * 1.1,
      canvas.width / 2,
      canvas.height / 2,
      0,
      0,
      'black'
    );
    pocketOuter.draw();
    pocketInner.draw();

    while (balls.length < number) {
      const randomR = radius[Math.round(Math.random() * (radius.length - 1))];
      const [randomX, randomY] = randomXY(randomR);
      balls.push(
        new Ball(
          randomR,
          randomX,
          randomY,
          0,
          0,
          colors[Math.round(Math.random() * (colors.length - 1))]
        )
      );
    }

    const checkGoal = (r, x, y, ind) => {
      if (
        Math.sqrt((canvas.width / 2 - x) ** 2 + (canvas.height / 2 - y) ** 2) <
        pocketInner.r - r
      ) {
        balls[ind].r = 0;
        balls.splice(ind, 1);
        over.classList.add('visible');
        newGame.classList.add('visible');
        numberInput.setAttribute('disabled', 'disabled');
        setTimeout(() => {
          balls.length = 0;
        }, 500);
      }
    };

    const stopgame = () => {
      over.classList.add('visible');
      newGame.classList.add('visible');
      numberInput.setAttribute('disabled', 'disabled');
      balls.length = 0;
      chooseColor.classList.remove('visible');
    };

    stopGame?.addEventListener('click', stopgame);

    function draw() {
      balls.forEach((ball, ind) => {
        const { r, x, y } = ball;
        checkGoal(r, x, y, ind);
        const { width, height } = canvas;
        ctx.clearRect(0, 0, width, height);
        pocketOuter.draw();
        pocketInner.draw();
        balls.forEach((b) => b.draw());
        ball.x += ball.vx;
        ball.y += ball.vy;
        if (y + ball.vy > height - r) {
          ball.y = height - r;
        }
        if (y + ball.vy < r) {
          ball.y = r;
        }
        if (y + ball.vy > height - r || y + ball.vy < r) {
          ball.vy = decrement(ball.vy, r);
        }
        if (x + ball.vx > width - r) {
          ball.x = width - r;
        }
        if (x + ball.vx < r) {
          ball.x = r;
        }
        if (x + ball.vx > width - r || x + ball.vx < r) {
          ball.vx = decrement(ball.vx, r);
        }
      });
      window.requestAnimationFrame(draw);
    }

    const handleMoveUp = (e) => {
      const [ex, ey] = getXY(e);
      const dists = [];
      balls.forEach((ball, ind) => {
        dists[ind] = {
          dist: Math.sqrt((ex - ball.x) ** 2 + (ey - ball.y) ** 2),
          r: ball.r,
        };
      });
      if (dists.some((el) => el.dist < el.r * 1.5)) {
        canvas.style.cursor = 'grab';
      } else {
        canvas.style.cursor = 'default';
      }
    };

    window.requestAnimationFrame(draw);

    const ballPush = (e, ball) => {
      const eXStart = e.clientX;
      const eYStart = e.clientY;
      const t1 = performance.now();
      const f = (ev) => {
        const eXEnd = ev.clientX;
        const eYEnd = ev.clientY;
        const stepX = eXEnd - eXStart;
        const stepY = eYEnd - eYStart;
        if (
          (Math.abs(stepX) > 20 && Math.abs(stepX) < 30) ||
          (Math.abs(stepY) > 20 && Math.abs(stepY) < 30)
        ) {
          const t2 = performance.now() - t1;
          ball.vx = Math.round((70 * stepX) / t2);
          ball.vy = Math.round((70 * stepY) / t2);
        }
      };
      canvas.addEventListener('mousemove', f);
      setTimeout(() => canvas.removeEventListener('mousemove', f), 500);
    };

    const changeColor = (e, ball) => {
      const ex = e.clientX;
      const ey = ball.y;
      canvas.style.cursor = 'default';
      chooseColor.classList.add('visible');
      chooseColor.style.top = `${ey}px`;
      chooseColor.style.left = `${ex}px`;
      col.addEventListener('input', (ev) => {
        if (ball.active) {
          ball.color = ev.target.value;
          ball.draw();
        }
        col.classList.add('hidden');
      });
    };

    const handleDown = (e) => {
      balls.forEach((ball) => {
        ball.active = false;
      });
      document.oncontextmenu = () => false;
      const [ex, ey] = getXY(e);
      balls.forEach((ball) => {
        const dist = Math.sqrt((ex - ball.x) ** 2 + (ey - ball.y) ** 2);
        if (dist < ball.r * 1.5) {
          if (e.which === 1) {
            canvas.style.cursor = 'grabbing';
            ballPush(e, ball);
          } else {
            canvas.style.cursor = 'default';
            ball.active = true;
            changeColor(e, ball);
            col.classList.remove('hidden');
          }
        }
      });
    };

    canvas.addEventListener('mousemove', handleMoveUp);
    canvas.addEventListener('mouseup', handleMoveUp);
    canvas.addEventListener('mousedown', handleDown);

    balls.forEach((ball) => {
      ball.draw();
    });
  };
  body.addEventListener('load', initCanvas());
};

export default billiard;
