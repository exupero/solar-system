(ns nav.bodies
  (:require [nav.orbit :as o]
            [nav.geo :refer [deg->rad]]))

(def J2000 (js/Date. 2000 0 1 12 0 0))

(defprotocol IBody
  (-identifier [_])
  (-period [_])
  (-position [this date]))

(defn identifier [b]
  (-identifier b))

(defn period [b]
  (-period b))

(defn position [b date]
  (-position b date))

(defrecord Body [id a e i Ω ω P M0 t0]
  IBody
  (-identifier [_] id)
  (-period [_]
    ; days -> seconds
    (* P 24 60 60))
  (-position [this date]
    (o/position
      (* a 1000) ; km -> m
      e
      (deg->rad i)
      (deg->rad Ω)
      (deg->rad ω)
      (period this)
      (deg->rad M0)
      (/ (.getTime t0) 1000)
      (/ (.getTime date) 1000))))

(def bodies
  ;       name      a (km)       e         i° (ec)  Ω°        ω°        P (days)      M0°      t0
  [(Body. "Mercury" 57.90905e6   0.205630  7.005    48.331    29.124    87.969        174.796  J2000)
   (Body. "Venus"   108.208e6    0.006772  3.39458  76.860    54.884    224.701       50.115   J2000)
   (Body. "Earth"   149.598023e6 0.0167086 0.00005  -11.26064 114.20783 365.256363004 358.617  J2000)
   (Body. "Mars"    227.9392e6   0.0934    1.850    49.558    286.502   686.971       19.373   J2000)
   (Body. "Jupiter" 778.299e6    0.048498  1.303    100.464   273.867   4332.59       20.020   J2000)
   (Body. "Saturn"  1429.39e6    0.05555   2.485240 113.665   339.392   10759.22      317.020  J2000)
   (Body. "Uranus"  2875.04e6    0.046381  0.773    74.006    96.998857 30688.5       142.2386 J2000)
   (Body. "Neptune" 4504.45e6    0.009456  1.767975 131.784   276.336   60182         256.228  J2000)
   ])
