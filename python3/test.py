import numpy

a = ["1.jpg", "2.jpg", "3.jpg", "4.jpg"]
b = ["2.jpg", "4.jpg"]

c = numpy.setdiff1d(a, b)

print(c)
