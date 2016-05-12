(ns nav.geo)

(def c 2.998e8) ; m/s
(def e js/Math.E)
(def π js/Math.PI)
(def τ (* 2 π))

(def pow #(.pow js/Math %1 %2))
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
  (let [n 50
        step (/ period n)]
    (->> d
      (iterate #(seconds-after % (- step)))
      (take (inc n)))))

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

(defn fuel-to-ship-mass-ratio
  "acceleration in m/s^2
   distance in m
   exhaust-velocity in m/s"
  [acceleration distance exhaust-velocity]
  (let [numer (sqrt (* 2 acceleration distance))]
    (dec (pow e (/ numer exhaust-velocity)))))
