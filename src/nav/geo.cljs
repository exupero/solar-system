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

(def au->meters #(* % 1.496e11))

(def years->days #(* % 365.256363004))

(defn epoch
  ([y m d] (epoch y m d 12))
  ([y m d h]
   (js/Date. y (dec m) d h 0 0)))

(def J2000 (epoch 2000 1 1 12))
