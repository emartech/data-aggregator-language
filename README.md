# Data Aggregator

This package is meant to replace the Aggregator modules in the Strategic Dashboard Client, and possibly
the Suite Dashboard Service.

It aims to provide an identical interface, but does custom parsing instead of merely eval-ing the input.

This will 
 * produce better error handling (providing informative error messages instead of cryptic JS errors),
 * be more secure
 * and more elegant as well.
