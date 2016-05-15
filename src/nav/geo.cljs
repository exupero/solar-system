(ns nav.geo
  (:require-macros [nav.macros :refer [spy]]))

(def e js/Math.E)
(def π js/Math.PI)
(def τ (* 2 π))

(def c 2.998e8) ; m/s
(def G 6.6740831e-11)

(def pow #(.pow js/Math %1 %2))
(def ln #(.log js/Math %))
(def sqrt #(.sqrt js/Math %))
(def sqr #(* % %))
(def sin #(.sin js/Math %))
(def cos #(.cos js/Math %))
(def tan #(.tan js/Math %))

(defn atan
  ([x] (.atan js/Math x))
  ([x y] (.atan2 js/Math x y)))

(def deg->rad #(* % π (/ 180)))

(def diff #(.abs js/Math (- %1 %2)))

(defn newton [f f' x0 tolerance]
  (loop [x x0]
    (let [x-next (- x (/ (f x) (f' x)))]
      (if (< (diff x x-next) tolerance)
        x-next
        (recur x-next)))))

(defn linear [[x1 x2] [y1 y2]]
  (let [m (/ (- y1 y2) (- x1 x2))
        b (- y1 (* m x1))]
    #(+ b (* m %))))

(defn dist [a b]
  (sqrt (reduce + (map (comp sqr diff) a b))))

(defn zero-time [d]
  (let [d' (js/Date.)]
    (.setTime d' (.getTime d))
    (.setHours d' 0)
    (.setMinutes d' 0)
    (.setSeconds d' 0)
    (.setMilliseconds d' 0)
    d'))

(defn today []
  (zero-time (js/Date.)))

(defn seconds-after [d n]
  (let [d' (js/Date.)]
    (.setTime d' (+ (.getTime d) (* n 1000)))
    d'))

(defn date-range
  ([start stop] (date-range start stop 1))
  ([start stop step]
   (let [stop (zero-time stop)]
     (loop [d (zero-time start)
            ds []]
       (if (< (.getTime d) (.getTime stop))
         (let [d' (js/Date.)]
           (.setTime d' (.getTime d))
           (.setDate d' (+ step (.getDate d')))
           (recur d' (conj ds d')))
         ds)))))

(defn orbit-dates [d period]
  (let [n 60
        step (/ period n)]
    (->> d
      (iterate #(seconds-after % (- step)))
      (take (inc n)))))

(defn meters->au [m]
  (/ m 1.496e11))

(defn round
  ([x] (round x 1))
  ([x n]
   (* (.round js/Math (/ x n)) n)))

(defn days->seconds [d]
  (* d 24 60 60))

(defn seconds->days-hours-minutes [s]
  (let [days (/ s 60 60 24)
        days' (int days)
        hours (* 24 (- days days'))
        hours' (int hours)
        minutes (* 60 (- hours hours'))]
    [days' hours' (round minutes)]))

(defn polar->cartesian [r θ]
  [(* r (cos θ))
   (* r (sin θ))
   0])

(defn dot-product [a b]
  (reduce + (map * a b)))

(defn matrix-transform [m v]
  (map #(dot-product % v) m))

(defn rotate-x [θ]
  [[1 0       0]
   [0 (cos θ) (- (sin θ))]
   [0 (sin θ) (cos θ)]])

(defn rotate-y [θ]
  [[(cos θ)     0 (sin θ)]
   [0           1 0]
   [(- (sin θ)) 0 (cos θ)]])

(defn rotate-z [θ]
  [[(cos θ) (- (sin θ)) 0]
   [(sin θ) (cos θ)     0]
   [0       0           1]])

(defn v-add
  "Vector vector addition"
  [& args]
  (apply mapv + args))

(defn v-mul
  "Vector scalar multiplication"
  [v s]
  (mapv #(* s %) v))

(defn v-div
  "Vector scalar division"
  [v s]
  (mapv #(/ % s) v))

(defn v-magnitude [v]
  (dist [0 0 0] v))

(defn v-norm [v]
  (v-div v (v-magnitude v)))

(defn tick [t [x v a]]
  [(v-add x (v-mul v t) (v-mul a (* 0.5 t)))
   (v-add v (v-mul a t))
   a])

(defn travel-time
  "d - distance (m)
   a - acceleration (m/s²)"
  [d a]
  ; accelerate at 'a' for half the distance, then
  ; accelerate at '-a' for the other half.
  ; d/2 = ½a(t/2)²
  ; d/a = (t/2)²
  ; √(d/a) = t/2
  ; 2√(d/a) = t
  (* 2 (sqrt (/ d a))))

(defn fuel-to-ship-mass-ratio
  "d - distance (m)
   v - exhaust velocity (m/s)
   a - acceleration (m/s²)"
  [d v a]
  ; vf² = vi² + 2ad
  ; vf² - vi² = 2ad
  ; (vf - vi)(vf + vi) = 2ad
  ; Δv (vf + vi) = 2ad
  ; (Δv)² = 2ad  -- where vi = 0
  ; Δv = √(2ad)
  ; Δv = ve ln(m0/md)  -- Tsiolkovsky rocket equation
  ; √(2ad) = ve ln(m0/md)
  ; √(2ad)/ve = ln (m0/md)
  ; e^(√(2ad)/ve) = m0/md
  ;               = (md+mf)/md
  ;               = 1 + mf/md
  ; e^(√(2ad)/ve) - 1 = mf/md
  (dec (pow e (/ (sqrt (* 2 a d)) v))))
