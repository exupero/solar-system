(ns nav.orbit
  (:require-macros [nav.macros :refer [spy]])
  (:require [nav.geo :as geo :refer [τ sqrt pow sqr sin cos tan atan newton]]))

; a  - semi-major axis
; e  - eccentricity
; i  - inclination
; Ω  - longitude of the ascending node
; ω  - argument of periapsis
; M  - mean anomaly
; M0 - mean anomaly at epoch
; E  - eccentric anomaly
; ν  - true anomaly
; r  - heliocentric distance
; t  - time
; t0 - time of epoch
; P  - period

(defn mean-anomaly [M0 P t0 t]
  (-> t (- t0) (* τ) (/ P) (+ M0)))

(defn eccentric-anomaly [e M]
  (let [f #(- % (* e (sin %)) M)
        f' #(- 1 (* e (cos %)))]
    (newton f f' M 1e-7)))

(defn true-anomaly [e E]
  (* 2 (atan (* (sqrt (+ 1 e)) (sin (/ E 2)))
             (* (sqrt (- 1 e)) (cos (/ E 2))))))

(defn radius [a e ν]
  (/ (* a (- 1 (sqr e)))
     (+ 1 (* e (cos ν)))))

(defn -position [a e i Ω ω P M0 t0 t]
  (let [M (mean-anomaly M0 P t0 t)
        E (eccentric-anomaly e M)
        ν (true-anomaly e E)
        r (radius a e ν)]
    (->> (geo/polar->cartesian r ν)
      (geo/matrix-transform (geo/rotate-z ω))
      (geo/matrix-transform (geo/rotate-x i))
      (geo/matrix-transform (geo/rotate-z Ω)))))

(defn position [body date]
  (if-let [p (:position body)]
    p
    (-position
      (:semi-major-axis body)
      (:eccentricity body)
      (:inclination body)
      (:longitude-of-ascending-node body)
      (:argument-of-perihelion body)
      (:period body)
      (:mean-anomaly-at-epoch body)
      (/ (.getTime (body :epoch)) 1000)
      (/ (.getTime date) 1000)
      )))
